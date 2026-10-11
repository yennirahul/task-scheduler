package com.example.worker.grpc;

import com.example.scheduler.grpc.TaskDispatchParam;
import com.example.scheduler.grpc.TaskDispatchResponse;
import com.example.scheduler.grpc.WorkerGrpcServiceGrpc;
import com.example.worker.execution.ActiveTaskTracker;
import com.example.worker.execution.ExecutionContext;
import com.example.worker.execution.JobExecutor;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerDispatchGrpcService extends WorkerGrpcServiceGrpc.WorkerGrpcServiceImplBase {

    private final JobExecutor jobExecutor;
    private final ActiveTaskTracker activeTaskTracker;

    @Override
    public void dispatchTask(TaskDispatchParam request, StreamObserver<TaskDispatchResponse> responseObserver) {
        activeTaskTracker.startTask();
        try {
            log.info("Received execution {} of type {}", request.getExecutionId(), request.getTaskType());
            ExecutionContext context = ExecutionContext.builder()
                    .executionId(request.getExecutionId())
                    .jobId(request.getJobId())
                    .taskType(request.getTaskType().trim().toUpperCase())
                    .taskData(request.getTaskData())
                    .timeoutSeconds(request.getTimeoutSeconds())
                    .attemptNumber(request.getAttemptNumber())
                    .build();

            String result = jobExecutor.executeTask(context);
            responseObserver.onNext(TaskDispatchResponse.newBuilder()
                    .setAccepted(true)
                    .setExecutionId(request.getExecutionId())
                    .setMessage("Task completed successfully")
                    .setStatus("COMPLETED")
                    .setResult(result == null ? "" : result)
                    .build());
            responseObserver.onCompleted();
        } catch (Exception exception) {
            log.error("Execution {} failed: {}", request.getExecutionId(), exception.getMessage(), exception);
            responseObserver.onNext(TaskDispatchResponse.newBuilder()
                    .setAccepted(true)
                    .setExecutionId(request.getExecutionId())
                    .setMessage("Task execution failed")
                    .setStatus("FAILED")
                    .setErrorDetails(exception.getMessage() == null ? exception.getClass().getSimpleName() : exception.getMessage())
                    .build());
            responseObserver.onCompleted();
        } finally {
            activeTaskTracker.finishTask();
        }
    }
}
