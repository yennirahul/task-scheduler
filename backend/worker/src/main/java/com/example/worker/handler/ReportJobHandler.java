package com.example.worker.handler;

import com.example.worker.execution.ExecutionContext;
import com.example.worker.execution.JobHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ReportJobHandler implements JobHandler {

    @Override
    public String getTaskType() {
        return "REPORT";
    }

    @Override
    public String execute(ExecutionContext context) throws Exception {
        log.info("[REPORT TASK] Execution ID: {}, Report Config: {}", context.getExecutionId(), context.getTaskData());
        Thread.sleep(2000);
        return "Report generated successfully. PDF available at /reports/" + context.getExecutionId() + ".pdf";
    }
}
