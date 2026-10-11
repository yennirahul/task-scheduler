package com.example.scheduler.repository;

import com.example.scheduler.entity.JobExecution;
import com.example.scheduler.enums.ExecutionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobExecutionRepository extends JpaRepository<JobExecution, String> {
    List<JobExecution> findByJobIdOrderByCreatedAtDesc(String jobId);
    List<JobExecution> findByWorkerIdAndStatusIn(String workerId, List<ExecutionStatus> statuses);
    List<JobExecution> findByStatus(ExecutionStatus status);

    List<JobExecution> findByStatusInAndStartedAtBefore(List<ExecutionStatus> statuses, LocalDateTime cutoff);

    long countByStatus(ExecutionStatus status);
}
