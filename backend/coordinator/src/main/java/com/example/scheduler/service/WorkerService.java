package com.example.scheduler.service;

import com.example.scheduler.dto.WorkerResponse;
import com.example.scheduler.entity.WorkerNode;
import com.example.scheduler.exception.ResourceNotFoundException;
import com.example.scheduler.repository.WorkerNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerNodeRepository workerNodeRepository;

    public List<WorkerResponse> getAllWorkers() {
        return workerNodeRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public WorkerResponse getWorkerById(String id) {
        WorkerNode worker = workerNodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found: " + id));
        return mapToResponse(worker);
    }

    public WorkerResponse mapToResponse(WorkerNode worker) {
        return WorkerResponse.builder()
                .id(worker.getId())
                .workerId(worker.getWorkerId())
                .hostname(worker.getHostname())
                .port(worker.getPort())
                .status(worker.getStatus())
                .maxConcurrentTasks(worker.getMaxConcurrentTasks())
                .activeTasksCount(worker.getActiveTasksCount())
                .supportedTaskTypes(worker.getSupportedTaskTypes())
                .cpuUsage(worker.getCpuUsage())
                .memoryUsageMB(worker.getMemoryUsageMB())
                .lastHeartbeatAt(worker.getLastHeartbeatAt())
                .registeredAt(worker.getRegisteredAt())
                .build();
    }
}
