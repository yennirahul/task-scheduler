package com.example.worker.heartbeat;

import com.example.worker.client.CoordinatorGrpcClient;
import com.example.worker.execution.ActiveTaskTracker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;

@Service
@RequiredArgsConstructor
@Slf4j
public class HeartbeatService implements CommandLineRunner {

    private final CoordinatorGrpcClient coordinatorClient;
    private final ActiveTaskTracker activeTaskTracker;

    @Override
    public void run(String... args) throws Exception {
        log.info("Registering worker node with coordinator...");
        coordinatorClient.registerWorker();
    }

    @Scheduled(fixedRate = 15000, initialDelay = 15000)
    public void refreshRegistration() {
        // Retry registration in case the coordinator was still starting during worker boot.
        coordinatorClient.registerWorker();
    }

    @Scheduled(fixedRate = 5000)
    public void sendHeartbeat() {
        double cpu = ManagementFactory.getOperatingSystemMXBean().getSystemLoadAverage();
        long freeMem = Runtime.getRuntime().freeMemory();
        long totalMem = Runtime.getRuntime().totalMemory();
        double usedMemoryMB = (totalMem - freeMem) / (1024.0 * 1024.0);

        coordinatorClient.sendHeartbeat(cpu > 0 ? cpu : 0.0, usedMemoryMB, activeTaskTracker.getActiveTasks());
    }
}
