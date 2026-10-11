package com.example.scheduler.controller;

import com.example.scheduler.dto.JobRequest;
import com.example.scheduler.dto.JobResponse;
import com.example.scheduler.enums.JobStatus;
import com.example.scheduler.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody JobRequest request, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "SYSTEM";
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(request, username));
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobResponse> updateJobStatus(@PathVariable String id, @RequestParam JobStatus status, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "SYSTEM";
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : "SYSTEM";
        jobService.deleteJob(id, username);
        return ResponseEntity.noContent().build();
    }
}
