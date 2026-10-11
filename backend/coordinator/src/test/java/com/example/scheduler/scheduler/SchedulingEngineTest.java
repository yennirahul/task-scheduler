package com.example.scheduler.scheduler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SchedulingEngineTest {

    @Mock
    private DueJobProcessor dueJobProcessor;

    @Mock
    private RetryScheduler retryScheduler;

    @InjectMocks
    private SchedulingEngine schedulingEngine;

    @Test
    void testPollAndProcessDueJobs() {
        schedulingEngine.pollAndProcessDueJobs();

        verify(dueJobProcessor, times(1)).processDueJobs();
        verify(retryScheduler, times(1)).processRetries();
    }
}
