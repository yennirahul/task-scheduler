package com.example.scheduler.controller;

import com.example.scheduler.enums.ExecutionStatus;
import com.example.scheduler.enums.JobStatus;
import com.example.scheduler.enums.WorkerStatus;
import com.example.scheduler.repository.JobExecutionRepository;
import com.example.scheduler.repository.ScheduledJobRepository;
import com.example.scheduler.repository.WorkerNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ScheduledJobRepository jobRepository;
    private final WorkerNodeRepository workerRepository;
    private final JobExecutionRepository executionRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalJobs", jobRepository.count());
        stats.put("activeJobs", jobRepository.countByStatus(JobStatus.ACTIVE));
        stats.put("pausedJobs", jobRepository.countByStatus(JobStatus.PAUSED));
        stats.put("completedJobs", jobRepository.countByStatus(JobStatus.COMPLETED));

        stats.put("totalWorkers", workerRepository.count());
        stats.put("onlineWorkers", workerRepository.countByStatus(WorkerStatus.ONLINE) + workerRepository.countByStatus(WorkerStatus.IDLE) + workerRepository.countByStatus(WorkerStatus.BUSY));
        stats.put("offlineWorkers", workerRepository.countByStatus(WorkerStatus.OFFLINE));

        stats.put("totalExecutions", executionRepository.count());
        stats.put("successfulExecutions", executionRepository.countByStatus(ExecutionStatus.SUCCESS));
        stats.put("failedExecutions", executionRepository.countByStatus(ExecutionStatus.FAILED));
        stats.put("runningExecutions", executionRepository.countByStatus(ExecutionStatus.RUNNING) + executionRepository.countByStatus(ExecutionStatus.DISPATCHED));

        return ResponseEntity.ok(stats);
    }
}
