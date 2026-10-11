# System Architecture

## Overview
The Distributed Task Scheduler is built using a distributed master-worker architecture.

```
+------------------+         REST API        +-------------------------+
|   React Frontend | <=====================> | Spring Boot Coordinator |
+------------------+   (JWT Auth, JSON)      +-------------------------+
                                                         ||
                                                  gRPC   || (Protobuf)
                                                         \/
                                             +------------------------+
                                             |  Java Worker Nodes     |
                                             +------------------------+
```

### Components
1. **Frontend (React + Vite + TailwindCSS)**: Web UI for managing jobs, monitoring workers, tracking executions, and inspecting audit logs.
2. **Coordinator (Spring Boot 3 + Java 21)**: Central scheduling server handling job state, gRPC worker dispatching, heartbeat health monitoring, and task retries.
3. **Worker (Java 21 + gRPC)**: Independent worker nodes executing registered task handlers (LOGGING, ARITHMETIC, REPORT) using Java 21 Virtual Threads.
4. **Database (MySQL 8.0)**: Relational store with Flyway migration management.
