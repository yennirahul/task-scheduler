package com.example.scheduler.repository;

import com.example.scheduler.entity.WorkerNode;
import com.example.scheduler.enums.WorkerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerNodeRepository extends JpaRepository<WorkerNode, String> {
    Optional<WorkerNode> findByWorkerId(String workerId);
    List<WorkerNode> findByStatus(WorkerStatus status);
    List<WorkerNode> findByStatusIn(List<WorkerStatus> statuses);

    List<WorkerNode> findByLastHeartbeatAtBeforeAndStatusNot(LocalDateTime cutoff, WorkerStatus status);

    long countByStatus(WorkerStatus status);
}
