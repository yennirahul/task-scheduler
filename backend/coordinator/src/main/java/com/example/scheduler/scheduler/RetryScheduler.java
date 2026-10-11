package com.example.scheduler.scheduler;

import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.enums.ExecutionStatus;
import com.example.scheduler.repository.JobExecutionRepository;
import com.example.scheduler.service.DispatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RetryScheduler {

    private final JobExecutionRepository executionRepository;
    private final DispatchService dispatchService;

    @Transactional
    public void processRetries() {
        List<JobExecution> pendingRetries = executionRepository.findByStatus(ExecutionStatus.RETRYING);
        for (JobExecution execution : pendingRetries) {
            log.info("Processing retry for execution: {}", execution.getId());
            dispatchService.dispatchJobExecution(execution, execution.getJob());
        }
    }
}
