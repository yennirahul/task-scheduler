package com.example.scheduler.service;

import com.example.scheduler.entity.ExecutionEvent;
import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.entity.ScheduledJob;
import com.example.scheduler.entity.WorkerNode;
import com.example.scheduler.enums.ExecutionStatus;
import com.example.scheduler.enums.WorkerStatus;
import com.example.scheduler.grpc.GrpcDispatchClient;
import com.example.scheduler.grpc.TaskDispatchResponse;
import com.example.scheduler.repository.ExecutionEventRepository;
import com.example.scheduler.repository.JobExecutionRepository;
import com.example.scheduler.repository.WorkerNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DispatchService {

    private final WorkerNodeRepository workerRepository;
    private final JobExecutionRepository executionRepository;
    private final ExecutionEventRepository eventRepository;
    private final GrpcDispatchClient grpcDispatchClient;

    @Transactional
    public boolean dispatchJobExecution(JobExecution execution, ScheduledJob job) {
        String previousWorkerId = execution.getWorkerId();
        if (execution.getStatus() == ExecutionStatus.RETRYING && previousWorkerId != null) {
            int attempt = execution.getAttemptNumber() == null ? 1 : execution.getAttemptNumber();
            int maxAttempts = job.getMaxRetries() == null ? 3 : job.getMaxRetries();
            if (attempt >= maxAttempts) {
                execution.setStatus(ExecutionStatus.FAILED);
                execution.setCompletedAt(LocalDateTime.now());
                execution.setErrorMessage("Maximum attempts reached after worker/dispatch failure");
                executionRepository.save(execution);
                recordEvent(execution, "TASK_FAILED", execution.getErrorMessage());
                return false;
            }
        }

        List<WorkerNode> availableWorkers = workerRepository.findByStatusIn(List.of(WorkerStatus.ONLINE, WorkerStatus.IDLE));

        Optional<WorkerNode> eligibleWorker = availableWorkers.stream()
                .filter(w -> w.getActiveTasksCount() < w.getMaxConcurrentTasks())
                .filter(w -> w.getSupportedTaskTypes() != null && w.getSupportedTaskTypes().contains(job.getTaskType()))
                .findFirst();

        if (eligibleWorker.isEmpty()) {
            // Fallback to any online worker
            eligibleWorker = availableWorkers.stream()
                    .filter(w -> w.getActiveTasksCount() < w.getMaxConcurrentTasks())
                    .findFirst();
        }

        if (eligibleWorker.isEmpty()) {
            log.warn("No available worker node for execution {}", execution.getId());
            execution.setStatus(ExecutionStatus.RETRYING);
            execution.setErrorMessage("Waiting for an available worker for task type: " + job.getTaskType());
            executionRepository.save(execution);
            recordEvent(execution, "DISPATCH_DEFERRED", "No available worker with capacity for task type: " + job.getTaskType());
            return false;
        }

        WorkerNode worker = eligibleWorker.get();
        if (execution.getStatus() == ExecutionStatus.RETRYING && previousWorkerId != null) {
            int attempt = execution.getAttemptNumber() == null ? 1 : execution.getAttemptNumber();
            execution.setAttemptNumber(attempt + 1);
        }
        execution.setWorkerId(worker.getWorkerId());
        execution.setStatus(ExecutionStatus.DISPATCHED);
        execution.setStartedAt(LocalDateTime.now());
        executionRepository.save(execution);

        worker.setActiveTasksCount(worker.getActiveTasksCount() + 1);
        if (worker.getActiveTasksCount() >= worker.getMaxConcurrentTasks()) {
            worker.setStatus(WorkerStatus.BUSY);
        }
        workerRepository.save(worker);

        recordEvent(execution, "DISPATCHED", "Dispatched to worker: " + worker.getWorkerId());

        // Dispatch via gRPC
        TaskDispatchResponse response = grpcDispatchClient.dispatchTask(worker.getHostname(), worker.getPort(), execution, job);
        if (response == null || !response.getAccepted()) {
            // Keep the execution recoverable; the retry scheduler will send it to another live worker.
            execution.setStatus(ExecutionStatus.RETRYING);
            execution.setErrorMessage("gRPC dispatch failed for worker " + worker.getWorkerId());
            execution.setCompletedAt(null);
            executionRepository.save(execution);

            worker.setActiveTasksCount(Math.max(0, worker.getActiveTasksCount() - 1));
            worker.setStatus(WorkerStatus.OFFLINE);
            workerRepository.save(worker);

            recordEvent(execution, "DISPATCH_ERROR", "gRPC invocation failed; worker marked offline and execution queued for retry");
            return false;
        }

        if ("COMPLETED".equalsIgnoreCase(response.getStatus())) {
            execution.setStatus(ExecutionStatus.SUCCESS);
            execution.setResultOutput(response.getResult());
            execution.setErrorMessage(null);
            execution.setCompletedAt(LocalDateTime.now());
            recordEvent(execution, "COMPLETED", response.getMessage());
        } else if ("FAILED".equalsIgnoreCase(response.getStatus())) {
            execution.setErrorMessage(response.getErrorDetails().isBlank() ? response.getMessage() : response.getErrorDetails());
            int attempt = execution.getAttemptNumber() == null ? 1 : execution.getAttemptNumber();
            int maxAttempts = job.getMaxRetries() == null ? 3 : job.getMaxRetries();
            if (attempt < maxAttempts) {
                execution.setStatus(ExecutionStatus.RETRYING);
                execution.setCompletedAt(null);
                recordEvent(execution, "TASK_FAILED_RETRYING", "Task failed; scheduling retry: " + execution.getErrorMessage());
            } else {
                execution.setStatus(ExecutionStatus.FAILED);
                execution.setCompletedAt(LocalDateTime.now());
                recordEvent(execution, "TASK_FAILED", execution.getErrorMessage());
            }
        } else {
            execution.setStatus(ExecutionStatus.RUNNING);
        }
        executionRepository.save(execution);

        worker.setActiveTasksCount(Math.max(0, worker.getActiveTasksCount() - 1));
        if (worker.getStatus() == WorkerStatus.BUSY && worker.getActiveTasksCount() < worker.getMaxConcurrentTasks()) {
            worker.setStatus(WorkerStatus.IDLE);
        }
        workerRepository.save(worker);
        return true;
    }

    public void recordEvent(JobExecution execution, String eventType, String message) {
        ExecutionEvent event = ExecutionEvent.builder()
                .execution(execution)
                .eventType(eventType)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        eventRepository.save(event);
    }
}
