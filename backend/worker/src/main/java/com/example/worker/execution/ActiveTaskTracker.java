package com.example.worker.execution;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ActiveTaskTracker {
    private final AtomicInteger activeTasks = new AtomicInteger();

    public int startTask() {
        return activeTasks.incrementAndGet();
    }

    public int finishTask() {
        return activeTasks.updateAndGet(value -> Math.max(0, value - 1));
    }

    public int getActiveTasks() {
        return activeTasks.get();
    }
}
