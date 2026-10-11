package com.example.scheduler.controller;

import com.example.scheduler.dto.ExecutionResponse;
import com.example.scheduler.entity.ExecutionEvent;
import com.example.scheduler.service.ExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/executions")
@RequiredArgsConstructor
public class ExecutionController {

    private final ExecutionService executionService;

    @GetMapping
    public ResponseEntity<List<ExecutionResponse>> getAllExecutions() {
        return ResponseEntity.ok(executionService.getAllExecutions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExecutionResponse> getExecutionById(@PathVariable String id) {
        return ResponseEntity.ok(executionService.getExecutionById(id));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ExecutionResponse>> getExecutionsByJobId(@PathVariable String jobId) {
        return ResponseEntity.ok(executionService.getExecutionsByJobId(jobId));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<ExecutionEvent>> getExecutionEvents(@PathVariable String id) {
        return ResponseEntity.ok(executionService.getExecutionEvents(id));
    }
}
