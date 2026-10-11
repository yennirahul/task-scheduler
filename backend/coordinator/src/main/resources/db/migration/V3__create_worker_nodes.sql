CREATE TABLE IF NOT EXISTS worker_nodes (
    id VARCHAR(36) PRIMARY KEY,
    worker_id VARCHAR(100) NOT NULL UNIQUE,
    hostname VARCHAR(100) NOT NULL,
    port INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'IDLE', -- ONLINE, BUSY, IDLE, OFFLINE, UNHEALTHY
    max_concurrent_tasks INT NOT NULL DEFAULT 5,
    active_tasks_count INT NOT NULL DEFAULT 0,
    supported_task_types TEXT,
    cpu_usage DOUBLE PRECISION DEFAULT 0.0,
    memory_usage_mb DOUBLE PRECISION DEFAULT 0.0,
    last_heartbeat_at DATETIME,
    registered_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
