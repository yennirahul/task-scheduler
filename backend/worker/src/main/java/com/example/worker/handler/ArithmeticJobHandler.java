package com.example.worker.handler;

import com.example.worker.execution.ExecutionContext;
import com.example.worker.execution.JobHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ArithmeticJobHandler implements JobHandler {

    @Override
    public String getTaskType() {
        return "ARITHMETIC";
    }

    @Override
    public String execute(ExecutionContext context) throws Exception {
        log.info("[ARITHMETIC TASK] Execution ID: {}, Expression: {}", context.getExecutionId(), context.getTaskData());
        Thread.sleep(500);
        return "Calculated result for expression [" + context.getTaskData() + "]: 42";
    }
}
