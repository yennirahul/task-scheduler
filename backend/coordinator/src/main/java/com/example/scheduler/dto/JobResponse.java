package com.example.scheduler.dto;

import com.example.scheduler.enums.JobStatus;
import com.example.scheduler.enums.ScheduleType;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {
    private String id;
    private String name;
    private String description;
    private String taskType;
    private String taskData;
    private ScheduleType scheduleType;
    private String cronExpression;
    private Long fixedRateMs;
    private JobStatus status;
    private Integer maxRetries;
    private Integer timeoutSeconds;
    private LocalDateTime nextRunAt;
    private LocalDateTime lastRunAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
