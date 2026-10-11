package com.example.scheduler.service;

import com.example.scheduler.dto.ExecutionResponse;
import com.example.scheduler.entity.ExecutionEvent;
import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.exception.ResourceNotFoundException;
import com.example.scheduler.repository.ExecutionEventRepository;
import com.example.scheduler.repository.JobExecutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExecutionService {

    private final JobExecutionRepository executionRepository;
    private final ExecutionEventRepository eventRepository;

    public List<ExecutionResponse> getAllExecutions() {
        return executionRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ExecutionResponse getExecutionById(String id) {
        JobExecution execution = executionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Execution not found: " + id));
        return mapToResponse(execution);
    }

    public List<ExecutionResponse> getExecutionsByJobId(String jobId) {
        return executionRepository.findByJobIdOrderByCreatedAtDesc(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ExecutionEvent> getExecutionEvents(String executionId) {
        return eventRepository.findByExecutionIdOrderByTimestampAsc(executionId);
    }

    public ExecutionResponse mapToResponse(JobExecution ex) {
        return ExecutionResponse.builder()
                .id(ex.getId())
                .jobId(ex.getJob().getId())
                .jobName(ex.getJob().getName())
                .workerId(ex.getWorkerId())
                .status(ex.getStatus())
                .attemptNumber(ex.getAttemptNumber())
                .taskData(ex.getTaskData())
                .resultOutput(ex.getResultOutput())
                .errorMessage(ex.getErrorMessage())
                .startedAt(ex.getStartedAt())
                .completedAt(ex.getCompletedAt())
                .createdAt(ex.getCreatedAt())
                .build();
    }
}
