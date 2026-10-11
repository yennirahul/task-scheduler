# API Documentation

## Authentication APIs
- `POST /api/v1/auth/login`: Authenticate admin/user and return JWT token.

## Scheduled Jobs APIs
- `GET /api/v1/jobs`: List all scheduled jobs.
- `POST /api/v1/jobs`: Create a new scheduled job.
- `GET /api/v1/jobs/{id}`: Get job details.
- `PATCH /api/v1/jobs/{id}/status?status=PAUSED`: Pause or resume a job.
- `DELETE /api/v1/jobs/{id}`: Delete a job.

## Worker Nodes APIs
- `GET /api/v1/workers`: List all registered worker nodes and their telemetry.
- `GET /api/v1/workers/{id}`: Get worker details.

## Executions & Monitoring APIs
- `GET /api/v1/executions`: List execution history.
- `GET /api/v1/executions/{id}`: Get execution details.
- `GET /api/v1/executions/{id}/events`: Get execution lifecycle events.
- `GET /api/v1/dashboard/stats`: Summary counts for system dashboard.
- `GET /api/v1/audit-logs`: Admin audit trail.
