package com.example.scheduler.service;

import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.entity.ScheduledJob;
import com.example.scheduler.enums.JobStatus;
import com.example.scheduler.enums.ScheduleType;
import com.example.scheduler.grpc.GrpcDispatchClient;
import com.example.scheduler.repository.ExecutionEventRepository;
import com.example.scheduler.repository.JobExecutionRepository;
import com.example.scheduler.repository.WorkerNodeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DispatchServiceTest {

    @Mock
    private WorkerNodeRepository workerRepository;

    @Mock
    private JobExecutionRepository executionRepository;

    @Mock
    private ExecutionEventRepository eventRepository;

    @Mock
    private GrpcDispatchClient grpcDispatchClient;

    @InjectMocks
    private DispatchService dispatchService;

    @Test
    void testDispatchNoAvailableWorkers() {
        ScheduledJob job = ScheduledJob.builder()
                .id("job-1")
                .name("Job 1")
                .taskType("LOGGING")
                .scheduleType(ScheduleType.ONE_TIME)
                .status(JobStatus.ACTIVE)
                .build();

        JobExecution execution = JobExecution.builder()
                .id("exec-1")
                .job(job)
                .build();

        when(workerRepository.findByStatusIn(anyList())).thenReturn(Collections.emptyList());

        boolean dispatched = dispatchService.dispatchJobExecution(execution, job);

        assertFalse(dispatched);
    }
}
