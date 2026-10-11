package com.example.scheduler.grpc;

import com.example.scheduler.entity.WorkerNode;
import com.example.scheduler.enums.WorkerStatus;
import com.example.scheduler.repository.WorkerNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkerRegistry {

    private final WorkerNodeRepository workerNodeRepository;

    public void registerOrUpdateWorker(String workerId, String hostname, int port, int maxConcurrentTasks, String supportedTaskTypes) {
        Optional<WorkerNode> existing = workerNodeRepository.findByWorkerId(workerId);
        WorkerNode node;
        if (existing.isPresent()) {
            node = existing.get();
            node.setHostname(hostname);
            node.setPort(port);
            node.setMaxConcurrentTasks(maxConcurrentTasks);
            node.setSupportedTaskTypes(supportedTaskTypes);
            node.setLastHeartbeatAt(LocalDateTime.now());
            if (node.getStatus() == WorkerStatus.OFFLINE || node.getStatus() == WorkerStatus.UNHEALTHY) {
                node.setStatus(WorkerStatus.ONLINE);
            }
        } else {
            node = WorkerNode.builder()
                    .workerId(workerId)
                    .hostname(hostname)
                    .port(port)
                    .maxConcurrentTasks(maxConcurrentTasks)
                    .activeTasksCount(0)
                    .supportedTaskTypes(supportedTaskTypes)
                    .status(WorkerStatus.ONLINE)
                    .lastHeartbeatAt(LocalDateTime.now())
                    .build();
        }
        workerNodeRepository.save(node);
        log.info("Worker registered/updated: {}", workerId);
    }

    public void updateHeartbeat(String workerId, double cpuUsage, double memoryUsageMB, int activeTasksCount) {
        workerNodeRepository.findByWorkerId(workerId).ifPresentOrElse(node -> {
            node.setCpuUsage(cpuUsage);
            node.setMemoryUsageMB(memoryUsageMB);
            node.setActiveTasksCount(activeTasksCount);
            node.setLastHeartbeatAt(LocalDateTime.now());
            if (node.getStatus() == WorkerStatus.OFFLINE || node.getStatus() == WorkerStatus.UNHEALTHY) {
                node.setStatus(node.getActiveTasksCount() >= node.getMaxConcurrentTasks() ? WorkerStatus.BUSY : WorkerStatus.ONLINE);
            }
            workerNodeRepository.save(node);
        }, () -> {
            registerOrUpdateWorker(workerId, "localhost", 9091, 5, "LOGGING,ARITHMETIC,REPORT");
        });
    }
}
