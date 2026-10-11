package com.example.scheduler.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchedulingEngine {

    private final DueJobProcessor dueJobProcessor;
    private final RetryScheduler retryScheduler;

    @Scheduled(fixedDelayString = "${scheduler.poll-interval-ms:5000}")
    public void pollAndProcessDueJobs() {
        log.debug("Polling for due jobs...");
        dueJobProcessor.processDueJobs();
        retryScheduler.processRetries();
    }
}
