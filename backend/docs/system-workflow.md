# System Workflow

## 1. Worker Registration & Heartbeat
- On startup, each Worker Node connects to the Coordinator via gRPC (`RegisterWorker`).
- The worker sends periodic heartbeats (`SendHeartbeat`) containing CPU usage, memory, and active task count every 5 seconds.
- If a worker misses heartbeats for >15s, `HeartbeatMonitor` marks it `OFFLINE`.

## 2. Job Scheduling & Dispatch
- `DueJobProcessor` polls MySQL for jobs where `status = 'ACTIVE'` and `next_run_at <= NOW()`.
- For each due job, a `JobExecution` is created in `PENDING` state.
- `DispatchService` selects an `ONLINE`/`IDLE` worker matching the `task_type` and dispatches via gRPC (`DispatchTask`).

## 3. Failure & Reassignment
- If a worker node crashes or goes offline mid-execution, `TaskRecoveryService` detects orphaned tasks.
- If attempts < `max_retries`, the task is set to `RETRYING` and reassigned to another healthy worker.
