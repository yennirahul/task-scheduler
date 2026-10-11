package com.example.scheduler.service;

import com.example.scheduler.dto.JobRequest;
import com.example.scheduler.dto.JobResponse;
import com.example.scheduler.entity.ScheduledJob;
import com.example.scheduler.enums.JobStatus;
import com.example.scheduler.enums.ScheduleType;
import com.example.scheduler.repository.ScheduledJobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private ScheduledJobRepository jobRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private JobService jobService;

    private ScheduledJob sampleJob;

    @BeforeEach
    void setUp() {
        sampleJob = ScheduledJob.builder()
                .id("job-123")
                .name("Test Job")
                .taskType("LOGGING")
                .scheduleType(ScheduleType.FIXED_RATE)
                .fixedRateMs(5000L)
                .status(JobStatus.ACTIVE)
                .build();
    }

    @Test
    void testCreateJobSuccess() {
        JobRequest request = JobRequest.builder()
                .name("Test Job")
                .taskType("LOGGING")
                .scheduleType(ScheduleType.FIXED_RATE)
                .fixedRateMs(5000L)
                .build();

        when(jobRepository.save(any(ScheduledJob.class))).thenReturn(sampleJob);

        JobResponse response = jobService.createJob(request, "admin");

        assertNotNull(response);
        assertEquals("Test Job", response.getName());
        verify(jobRepository, times(1)).save(any(ScheduledJob.class));
    }

    @Test
    void testGetJobByIdSuccess() {
        when(jobRepository.findById("job-123")).thenReturn(Optional.of(sampleJob));

        JobResponse response = jobService.getJobById("job-123");

        assertNotNull(response);
        assertEquals("job-123", response.getId());
    }
}
