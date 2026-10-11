package com.example.scheduler.monitoring;

import com.example.scheduler.entity.WorkerNode;
import com.example.scheduler.enums.WorkerStatus;
import com.example.scheduler.repository.WorkerNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkerHealthService {

    private final WorkerNodeRepository workerRepository;

    @Value("${scheduler.heartbeat-timeout-seconds:15}")
    private int heartbeatTimeoutSeconds;

    @Transactional
    public void checkWorkerHealth() {
        LocalDateTime cutoff = LocalDateTime.now().minusSeconds(heartbeatTimeoutSeconds);
        List<WorkerNode> staleWorkers = workerRepository.findByLastHeartbeatAtBeforeAndStatusNot(cutoff, WorkerStatus.OFFLINE);

        for (WorkerNode worker : staleWorkers) {
            log.warn("Worker node {} missed heartbeat deadline, marking OFFLINE", worker.getWorkerId());
            worker.setStatus(WorkerStatus.OFFLINE);
            workerRepository.save(worker);
        }
    }
}
