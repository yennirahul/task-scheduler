package com.example.scheduler.grpc;

import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerGrpcService extends WorkerGrpcServiceGrpc.WorkerGrpcServiceImplBase {

    private final WorkerRegistry workerRegistry;

    @Override
    public void registerWorker(RegisterWorkerRequest request, StreamObserver<RegisterWorkerResponse> responseObserver) {
        log.info("Received worker registration: {}", request.getWorkerId());
        String supportedTypes = String.join(",", request.getSupportedTaskTypesList());
        workerRegistry.registerOrUpdateWorker(
                request.getWorkerId(),
                request.getHostname(),
                request.getPort(),
                request.getMaxConcurrentTasks(),
                supportedTypes
        );

        RegisterWorkerResponse response = RegisterWorkerResponse.newBuilder()
                .setSuccess(true)
                .setMessage("Worker registered successfully")
                .setHeartbeatIntervalSeconds(5)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void sendHeartbeat(HeartbeatRequest request, StreamObserver<HeartbeatResponse> responseObserver) {
        workerRegistry.updateHeartbeat(
                request.getWorkerId(),
                request.getCpuUsage(),
                request.getMemoryUsageMB(),
                request.getActiveTasksCount()
        );

        HeartbeatResponse response = HeartbeatResponse.newBuilder()
                .setAcknowledged(true)
                .setCommand("NONE")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
