package com.example.scheduler.config;

import com.example.scheduler.grpc.WorkerGrpcService;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class GrpcServerConfig implements CommandLineRunner {

    @Value("${grpc.server.port:9090}")
    private int grpcPort;

    private final WorkerGrpcService workerGrpcService;
    private Server server;

    @Override
    public void run(String... args) throws Exception {
        server = ServerBuilder.forPort(grpcPort)
                .addService(workerGrpcService)
                .build();

        try {
            server.start();
            log.info("gRPC Server started on port {}", grpcPort);

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                log.info("Shutting down gRPC server...");
                if (server != null) {
                    server.shutdown();
                }
            }));
        } catch (IOException e) {
            log.error("Failed to start gRPC server on port {}", grpcPort, e);
        }
    }
}
