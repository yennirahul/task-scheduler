package com.example.scheduler.grpc;

import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.entity.ScheduledJob;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class GrpcDispatchClient {

    public TaskDispatchResponse dispatchTask(String hostname, int port, JobExecution execution, ScheduledJob job) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(hostname, port)
                .usePlaintext()
                .build();

        try {
            int timeoutSeconds = job.getTimeoutSeconds() != null && job.getTimeoutSeconds() > 0
                    ? job.getTimeoutSeconds() : 60;
            WorkerGrpcServiceGrpc.WorkerGrpcServiceBlockingStub stub = WorkerGrpcServiceGrpc.newBlockingStub(channel)
                    .withDeadlineAfter(timeoutSeconds + 5L, TimeUnit.SECONDS);

            TaskDispatchParam param = TaskDispatchParam.newBuilder()
                    .setExecutionId(execution.getId())
                    .setJobId(job.getId())
                    .setTaskType(job.getTaskType())
                    .setTaskData(job.getTaskData() != null ? job.getTaskData() : "")
                    .setTimeoutSeconds(timeoutSeconds)
                    .setAttemptNumber(execution.getAttemptNumber() == null ? 1 : execution.getAttemptNumber())
                    .build();

            TaskDispatchResponse response = stub.dispatchTask(param);
            log.info("gRPC task dispatch response for {}: accepted={}, status={}",
                    execution.getId(), response.getAccepted(), response.getStatus());
            return response;
        } catch (Exception exception) {
            log.error("Failed gRPC dispatch to {}:{} for execution {}", hostname, port, execution.getId(), exception);
            return null;
        } finally {
            channel.shutdown();
            try {
                if (!channel.awaitTermination(2, TimeUnit.SECONDS)) {
                    channel.shutdownNow();
                }
            } catch (InterruptedException interrupted) {
                Thread.currentThread().interrupt();
                channel.shutdownNow();
            }
        }
    }
}
