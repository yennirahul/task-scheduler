package com.example.worker.execution;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JobHandlerRegistry {

    private final Map<String, JobHandler> handlerMap;

    public JobHandlerRegistry(List<JobHandler> handlers) {
        this.handlerMap = handlers.stream()
                .collect(Collectors.toMap(handler -> handler.getTaskType(), Function.identity()));
    }

    public Optional<JobHandler> getHandler(String taskType) {
        return Optional.ofNullable(handlerMap.get(taskType));
    }
}
