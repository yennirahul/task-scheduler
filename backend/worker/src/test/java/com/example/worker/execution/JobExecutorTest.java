package com.example.worker.execution;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobExecutorTest {

    @Mock
    private JobHandlerRegistry handlerRegistry;

    @Mock
    private JobHandler mockHandler;

    private JobExecutor jobExecutor;

    @BeforeEach
    void setUp() {
        jobExecutor = new JobExecutor(handlerRegistry, Executors.newSingleThreadExecutor());
    }

    @Test
    void testExecuteTaskSuccess() throws Exception {
        ExecutionContext context = ExecutionContext.builder()
                .executionId("exec-1")
                .taskType("LOGGING")
                .taskData("test")
                .build();

        when(handlerRegistry.getHandler("LOGGING")).thenReturn(Optional.of(mockHandler));
        when(mockHandler.execute(context)).thenReturn("SUCCESS");

        String result = jobExecutor.executeTask(context);

        assertEquals("SUCCESS", result);
    }

    @Test
    void testExecuteTaskMissingHandler() {
        ExecutionContext context = ExecutionContext.builder()
                .executionId("exec-2")
                .taskType("UNKNOWN")
                .build();

        when(handlerRegistry.getHandler("UNKNOWN")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> jobExecutor.executeTask(context));
    }
}
