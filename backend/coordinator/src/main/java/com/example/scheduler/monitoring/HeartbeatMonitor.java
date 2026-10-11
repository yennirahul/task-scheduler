package com.example.scheduler.monitoring;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class HeartbeatMonitor {

    private final WorkerHealthService workerHealthService;
    private final TaskRecoveryService taskRecoveryService;

    @Scheduled(fixedDelay = 10000)
    public void monitorHeartbeats() {
        log.debug("Running periodic heartbeat and worker health check...");
        workerHealthService.checkWorkerHealth();
        taskRecoveryService.recoverOrphanedTasks();
    }
}
