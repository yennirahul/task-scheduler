package com.example.scheduler.repository;

import com.example.scheduler.entity.ExecutionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutionEventRepository extends JpaRepository<ExecutionEvent, String> {
    List<ExecutionEvent> findByExecutionIdOrderByTimestampAsc(String executionId);
}
