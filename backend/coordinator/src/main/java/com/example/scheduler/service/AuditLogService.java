package com.example.scheduler.service;

import com.example.scheduler.entity.AuditLog;
import com.example.scheduler.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async("taskExecutor")
    public void logAction(String username, String action, String entityName, String entityId, String details, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .username(username != null ? username : "SYSTEM")
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
