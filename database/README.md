# Database Schema & Migrations

This directory documents the MySQL 8.0 database schema and Flyway migration scripts used in the Distributed Task Scheduler.

## Table Overview
1. **`users`**: Manages authentication, roles (ADMIN, USER), and user profile info.
2. **`scheduled_jobs`**: Stores definitions for recurring (CRON, FIXED_RATE) and ONE_TIME scheduled jobs.
3. **`worker_nodes`**: Registers dynamic worker nodes, heartbeat telemetry, and capacity limits.
4. **`job_executions`**: Tracks every task dispatch attempt, state, results, and execution metrics.
5. **`execution_events`**: Audit trail of execution lifecycle transitions.
6. **`audit_logs`**: System security and administrative event audit log.

## Flyway Migrations Location
The versioned SQL migrations are located in the Coordinator module at:
`coordinator/src/main/resources/db/migration/`
- `V1__create_users.sql`
- `V2__create_scheduled_jobs.sql`
- `V3__create_worker_nodes.sql`
- `V4__create_job_executions.sql`
- `V5__create_events_and_audit_logs.sql`
