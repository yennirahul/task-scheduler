package com.example.worker.handler;

import com.example.worker.execution.ExecutionContext;
import com.example.worker.execution.JobHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class LoggingJobHandler implements JobHandler {

    @Override
    public String getTaskType() {
        return "LOGGING";
    }

    @Override
    public String execute(ExecutionContext context) throws Exception {
        log.info("[LOGGING TASK] Execution ID: {}, Data: {}", context.getExecutionId(), context.getTaskData());
        Thread.sleep(1000);
        return "Log recorded successfully for: " + context.getTaskData();
    }
}
