# Database Design Document

## Schema Entity Relationship Diagram
- `users` (1) ---> (N) `audit_logs`
- `scheduled_jobs` (1) ---> (N) `job_executions`
- `job_executions` (1) ---> (N) `execution_events`
- `worker_nodes` (1) ---> (N) `job_executions`

## Migration Files
- `V1__create_users.sql`
- `V2__create_scheduled_jobs.sql`
- `V3__create_worker_nodes.sql`
- `V4__create_job_executions.sql`
- `V5__create_events_and_audit_logs.sql`
