package com.example.scheduler.entity;

import com.example.scheduler.enums.WorkerStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker_nodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerNode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "worker_id", nullable = false, unique = true, length = 100)
    private String workerId;

    @Column(nullable = false, length = 100)
    private String hostname;

    @Column(nullable = false)
    private Integer port;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkerStatus status;

    @Column(name = "max_concurrent_tasks", nullable = false)
    @Builder.Default
    private Integer maxConcurrentTasks = 5;

    @Column(name = "active_tasks_count", nullable = false)
    @Builder.Default
    private Integer activeTasksCount = 0;

    @Column(name = "supported_task_types", columnDefinition = "TEXT")
    private String supportedTaskTypes;

    @Column(name = "cpu_usage")
    @Builder.Default
    private Double cpuUsage = 0.0;

    @Column(name = "memory_usage_mb")
    @Builder.Default
    private Double memoryUsageMB = 0.0;

    @Column(name = "last_heartbeat_at")
    private LocalDateTime lastHeartbeatAt;

    @Column(name = "registered_at", nullable = false, updatable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        if (status == null) status = WorkerStatus.IDLE;
        if (lastHeartbeatAt == null) lastHeartbeatAt = LocalDateTime.now();
    }
}
