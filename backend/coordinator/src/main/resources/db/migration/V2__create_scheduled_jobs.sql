CREATE TABLE IF NOT EXISTS scheduled_jobs (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) NOT NULL,
    task_data TEXT,
    schedule_type VARCHAR(20) NOT NULL, -- CRON, FIXED_RATE, ONE_TIME
    cron_expression VARCHAR(100),
    fixed_rate_ms BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, PAUSED, COMPLETED, FAILED
    max_retries INT NOT NULL DEFAULT 3,
    timeout_seconds INT NOT NULL DEFAULT 60,
    next_run_at DATETIME,
    last_run_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
