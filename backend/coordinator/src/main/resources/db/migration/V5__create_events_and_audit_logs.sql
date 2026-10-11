CREATE TABLE IF NOT EXISTS execution_events (
    id VARCHAR(36) PRIMARY KEY,
    execution_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    message TEXT,
    timestamp DATETIME NOT NULL,
    CONSTRAINT fk_event_execution FOREIGN KEY (execution_id) REFERENCES job_executions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(50),
    entity_id VARCHAR(36),
    details TEXT,
    ip_address VARCHAR(45),
    timestamp DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
