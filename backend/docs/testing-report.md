# Testing Report

## Unit & Integration Tests Summary
- `JobServiceTest`: Validates job creation, retrieval, and exception handling.
- `DispatchServiceTest`: Tests worker capacity allocation and fallback behaviors.
- `SchedulingEngineTest`: Verifies cron polling and retry execution scheduling loops.
- `HeartbeatMonitorTest`: Verifies offline worker detection and task recovery triggers.
- `JobExecutorTest`: Verifies worker-side task handler resolution and virtual thread execution.
