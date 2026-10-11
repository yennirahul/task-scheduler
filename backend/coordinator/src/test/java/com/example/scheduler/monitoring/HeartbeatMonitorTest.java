package com.example.scheduler.monitoring;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class HeartbeatMonitorTest {

    @Mock
    private WorkerHealthService workerHealthService;

    @Mock
    private TaskRecoveryService taskRecoveryService;

    @InjectMocks
    private HeartbeatMonitor heartbeatMonitor;

    @Test
    void testMonitorHeartbeats() {
        heartbeatMonitor.monitorHeartbeats();

        verify(workerHealthService, times(1)).checkWorkerHealth();
        verify(taskRecoveryService, times(1)).recoverOrphanedTasks();
    }
}
