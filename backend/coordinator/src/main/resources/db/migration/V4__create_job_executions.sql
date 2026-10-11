CREATE TABLE IF NOT EXISTS job_executions (
    id VARCHAR(36) PRIMARY KEY,
    job_id VARCHAR(36) NOT NULL,
    worker_id VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, DISPATCHED, RUNNING, SUCCESS, FAILED, TIMED_OUT, RETRYING
    attempt_number INT NOT NULL DEFAULT 1,
    task_data TEXT,
    result_output TEXT,
    error_message TEXT,
    started_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_execution_job FOREIGN KEY (job_id) REFERENCES scheduled_jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
