package com.example.scheduler.repository;

import com.example.scheduler.entity.ScheduledJob;
import com.example.scheduler.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledJobRepository extends JpaRepository<ScheduledJob, String> {
    List<ScheduledJob> findByStatus(JobStatus status);

    @Query("SELECT j FROM ScheduledJob j WHERE j.status = 'ACTIVE' AND j.nextRunAt <= :now")
    List<ScheduledJob> findDueJobs(LocalDateTime now);

    long countByStatus(JobStatus status);
}
