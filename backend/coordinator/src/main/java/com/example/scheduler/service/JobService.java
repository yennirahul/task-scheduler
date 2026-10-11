package com.example.scheduler.service;

import com.example.scheduler.dto.JobRequest;
import com.example.scheduler.dto.JobResponse;
import com.example.scheduler.entity.ScheduledJob;
import com.example.scheduler.enums.JobStatus;
import com.example.scheduler.enums.ScheduleType;
import com.example.scheduler.exception.ResourceNotFoundException;
import com.example.scheduler.repository.ScheduledJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import org.springframework.scheduling.support.CronExpression;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final ScheduledJobRepository jobRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public JobResponse createJob(JobRequest request, String username) {
        ScheduledJob job = ScheduledJob.builder()
                .name(request.getName())
                .description(request.getDescription())
                .taskType(request.getTaskType())
                .taskData(request.getTaskData())
                .scheduleType(request.getScheduleType())
                .cronExpression(request.getCronExpression())
                .fixedRateMs(request.getFixedRateMs())
                .status(JobStatus.ACTIVE)
                .maxRetries(request.getMaxRetries() != null ? request.getMaxRetries() : 3)
                .timeoutSeconds(request.getTimeoutSeconds() != null ? request.getTimeoutSeconds() : 60)
                .nextRunAt(calculateNextRun(request.getScheduleType(), request.getFixedRateMs(), request.getCronExpression()))
                .build();

        ScheduledJob saved = jobRepository.save(job);
        auditLogService.logAction(username, "CREATE_JOB", "ScheduledJob", saved.getId(), "Created job: " + saved.getName(), null);
        return mapToResponse(saved);
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JobResponse getJobById(String id) {
        ScheduledJob job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapToResponse(job);
    }

    @Transactional
    public JobResponse updateJobStatus(String id, JobStatus status, String username) {
        ScheduledJob job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        job.setStatus(status);
        if (status == JobStatus.ACTIVE && job.getNextRunAt() == null) {
            job.setNextRunAt(LocalDateTime.now());
        }
        ScheduledJob updated = jobRepository.save(job);
        auditLogService.logAction(username, "UPDATE_JOB_STATUS", "ScheduledJob", id, "Updated status to " + status, null);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteJob(String id, String username) {
        ScheduledJob job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        jobRepository.delete(job);
        auditLogService.logAction(username, "DELETE_JOB", "ScheduledJob", id, "Deleted job: " + job.getName(), null);
    }

    private LocalDateTime calculateNextRun(ScheduleType type, Long fixedRateMs, String cronExpression) {
        LocalDateTime now = LocalDateTime.now();
        if (type == ScheduleType.FIXED_RATE) {
            if (fixedRateMs == null || fixedRateMs <= 0) {
                throw new IllegalArgumentException("Fixed-rate interval must be greater than zero milliseconds");
            }
            return now.plusNanos(fixedRateMs * 1_000_000);
        }
        if (type == ScheduleType.CRON) {
            if (cronExpression == null || cronExpression.isBlank()) {
                throw new IllegalArgumentException("A cron expression is required for CRON schedules");
            }
            LocalDateTime next = CronExpression.parse(cronExpression).next(now);
            if (next == null) {
                throw new IllegalArgumentException("Cron expression has no next execution time");
            }
            return next;
        }
        return now;
    }

    public JobResponse mapToResponse(ScheduledJob job) {
        return JobResponse.builder()
                .id(job.getId())
                .name(job.getName())
                .description(job.getDescription())
                .taskType(job.getTaskType())
                .taskData(job.getTaskData())
                .scheduleType(job.getScheduleType())
                .cronExpression(job.getCronExpression())
                .fixedRateMs(job.getFixedRateMs())
                .status(job.getStatus())
                .maxRetries(job.getMaxRetries())
                .timeoutSeconds(job.getTimeoutSeconds())
                .nextRunAt(job.getNextRunAt())
                .lastRunAt(job.getLastRunAt())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
