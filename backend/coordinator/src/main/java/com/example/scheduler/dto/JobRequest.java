package com.example.scheduler.dto;

import com.example.scheduler.enums.ScheduleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobRequest {
    @NotBlank(message = "Job name is required")
    private String name;

    private String description;

    @NotBlank(message = "Task type is required")
    private String taskType;

    private String taskData;

    @NotNull(message = "Schedule type is required")
    private ScheduleType scheduleType;

    private String cronExpression;
    private Long fixedRateMs;

    private Integer maxRetries;
    private Integer timeoutSeconds;
}
