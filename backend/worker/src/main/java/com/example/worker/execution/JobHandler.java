package com.example.worker.execution;

public interface JobHandler {
    String getTaskType();
    String execute(ExecutionContext context) throws Exception;
}
