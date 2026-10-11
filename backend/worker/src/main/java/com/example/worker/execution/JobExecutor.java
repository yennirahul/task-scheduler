package com.example.worker.execution;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JobExecutor {

    private final JobHandlerRegistry handlerRegistry;
    private final ExecutorService taskExecutorService;

    public String executeTask(ExecutionContext context) throws Exception {
        Optional<JobHandler> handlerOpt = handlerRegistry.getHandler(context.getTaskType());

        if (handlerOpt.isEmpty()) {
            throw new IllegalArgumentException("No handler found for task type: " + context.getTaskType());
        }

        JobHandler handler = handlerOpt.get();
        log.info("Executing task {} with handler {}", context.getExecutionId(), handler.getTaskType());

        Future<String> future = taskExecutorService.submit(() -> handler.execute(context));
        int timeoutSeconds = context.getTimeoutSeconds() > 0 ? context.getTimeoutSeconds() : 60;
        try {
            return future.get(timeoutSeconds, TimeUnit.SECONDS);
        } catch (TimeoutException timeout) {
            future.cancel(true);
            throw new TimeoutException("Task " + context.getExecutionId() + " exceeded " + timeoutSeconds + " seconds");
        }
    }
}
