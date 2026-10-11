package com.example.worker.grpc;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkerGrpcServer implements CommandLineRunner {

    private final WorkerDispatchGrpcService dispatchService;

    @Value("${worker.port:9091}")
    private int workerPort;

    private Server server;

    @Override
    public void run(String... args) throws Exception {
        server = ServerBuilder.forPort(workerPort).addService(dispatchService).build().start();
        log.info("Worker gRPC dispatch server listening on port {}", workerPort);
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            if (server != null) {
                server.shutdown();
                try {
                    if (!server.awaitTermination(5, java.util.concurrent.TimeUnit.SECONDS)) {
                        server.shutdownNow();
                    }
                } catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                    server.shutdownNow();
                }
            }
        }));
    }
}
