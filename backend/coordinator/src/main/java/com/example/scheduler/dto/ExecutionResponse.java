package com.example.scheduler.dto;

import com.example.scheduler.enums.ExecutionStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionResponse {
    private String id;
    private String jobId;
    private String jobName;
    private String workerId;
    private ExecutionStatus status;
    private Integer attemptNumber;
    private String taskData;
    private String resultOutput;
    private String errorMessage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
}
