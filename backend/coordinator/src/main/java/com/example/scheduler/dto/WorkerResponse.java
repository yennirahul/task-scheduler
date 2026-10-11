package com.example.scheduler.dto;

import com.example.scheduler.enums.WorkerStatus;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerResponse {
    private String id;
    private String workerId;
    private String hostname;
    private Integer port;
    private WorkerStatus status;
    private Integer maxConcurrentTasks;
    private Integer activeTasksCount;
    private String supportedTaskTypes;
    private Double cpuUsage;
    private Double memoryUsageMB;
    private LocalDateTime lastHeartbeatAt;
    private LocalDateTime registeredAt;
}
