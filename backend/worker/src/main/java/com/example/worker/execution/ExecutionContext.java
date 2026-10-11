package com.example.worker.execution;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionContext {
    private String executionId;
    private String jobId;
    private String taskType;
    private String taskData;
    private int timeoutSeconds;
    private int attemptNumber;
}
