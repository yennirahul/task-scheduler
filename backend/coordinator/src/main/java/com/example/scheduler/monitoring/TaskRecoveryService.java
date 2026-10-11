package com.example.scheduler.monitoring;

import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.entity.ScheduledJob;
import com.example.scheduler.entity.WorkerNode;
import com.example.scheduler.enums.ExecutionStatus;
import com.example.scheduler.enums.WorkerStatus;
import com.example.scheduler.repository.JobExecutionRepository;
import com.example.scheduler.repository.WorkerNodeRepository;
import com.example.scheduler.service.DispatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskRecoveryService {

    private final JobExecutionRepository executionRepository;
    private final WorkerNodeRepository workerRepository;
    private final DispatchService dispatchService;

    @Transactional
    public void recoverOrphanedTasks() {
        List<WorkerNode> offlineWorkers = workerRepository.findByStatus(WorkerStatus.OFFLINE);
        for (WorkerNode worker : offlineWorkers) {
            List<JobExecution> activeExecutions = executionRepository.findByWorkerIdAndStatusIn(
                    worker.getWorkerId(),
                    List.of(ExecutionStatus.DISPATCHED, ExecutionStatus.RUNNING)
            );

            for (JobExecution execution : activeExecutions) {
                log.info("Recovering orphaned task execution {} from offline worker {}", execution.getId(), worker.getWorkerId());
                ScheduledJob job = execution.getJob();

                if (execution.getAttemptNumber() < job.getMaxRetries()) {
                    execution.setStatus(ExecutionStatus.RETRYING);
                    execution.setErrorMessage("Worker " + worker.getWorkerId() + " went offline. Re-dispatching...");
                    executionRepository.save(execution);

                    dispatchService.recordEvent(execution, "TASK_RECOVERED", "Re-dispatching attempt #" + execution.getAttemptNumber());
                    dispatchService.dispatchJobExecution(execution, job);
                } else {
                    execution.setStatus(ExecutionStatus.FAILED);
                    execution.setErrorMessage("Worker " + worker.getWorkerId() + " went offline. Max retries reached.");
                    executionRepository.save(execution);
                    dispatchService.recordEvent(execution, "TASK_FAILED", "Max retries reached after worker failure");
                }
            }
        }
    }
}
