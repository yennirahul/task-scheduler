package com.example.worker.client;

import com.example.scheduler.grpc.*;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
public class CoordinatorGrpcClient {

    @Value("${coordinator.host:localhost}")
    private String coordinatorHost;

    @Value("${coordinator.grpc-port:9090}")
    private int coordinatorPort;

    @Value("${worker.id:worker-node-1}")
    private String workerId;

    @Value("${worker.hostname:localhost}")
    private String hostname;

    @Value("${worker.port:9091}")
    private int port;

    @Value("${worker.max-concurrent-tasks:5}")
    private int maxConcurrentTasks;

    @Value("${worker.supported-task-types:LOGGING,ARITHMETIC,REPORT}")
    private String supportedTaskTypes;

    public void registerWorker() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(coordinatorHost, coordinatorPort)
                .usePlaintext()
                .build();
        try {
            WorkerGrpcServiceGrpc.WorkerGrpcServiceBlockingStub stub = WorkerGrpcServiceGrpc.newBlockingStub(channel);
            List<String> types = Arrays.asList(supportedTaskTypes.split(","));

            RegisterWorkerRequest request = RegisterWorkerRequest.newBuilder()
                    .setWorkerId(workerId)
                    .setHostname(hostname)
                    .setPort(port)
                    .setMaxConcurrentTasks(maxConcurrentTasks)
                    .addAllSupportedTaskTypes(types)
                    .build();

            RegisterWorkerResponse response = stub.registerWorker(request);
            log.info("Worker registration status: {}, message: {}", response.getSuccess(), response.getMessage());
        } catch (Exception e) {
            log.error("Failed to register with coordinator at {}:{}", coordinatorHost, coordinatorPort, e);
        } finally {
            channel.shutdown();
        }
    }

    public void sendHeartbeat(double cpu, double memory, int activeTasks) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(coordinatorHost, coordinatorPort)
                .usePlaintext()
                .build();
        try {
            WorkerGrpcServiceGrpc.WorkerGrpcServiceBlockingStub stub = WorkerGrpcServiceGrpc.newBlockingStub(channel);
            HeartbeatRequest request = HeartbeatRequest.newBuilder()
                    .setWorkerId(workerId)
                    .setCpuUsage(cpu)
                    .setMemoryUsageMB(memory)
                    .setActiveTasksCount(activeTasks)
                    .build();

            HeartbeatResponse response = stub.sendHeartbeat(request);
            log.debug("Heartbeat response acknowledged: {}", response.getAcknowledged());
        } catch (Exception e) {
            log.warn("Failed to send heartbeat to coordinator: {}", e.getMessage());
        } finally {
            channel.shutdown();
        }
    }
}
