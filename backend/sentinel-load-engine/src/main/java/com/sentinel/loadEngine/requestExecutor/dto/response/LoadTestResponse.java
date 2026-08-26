package com.sentinel.loadEngine.requestExecutor.dto.response;

import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestDataDTO;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestStatus;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLogConfig;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoadTestResponse {

    public LoadTestResponse(LoadTestData loadTestData, LoadTestRunLog runLog) {
        this.id = loadTestData.getId();
        this.name = loadTestData.getName();
        this.associatedLoadTestData = loadTestData.getTestData();
        this.status = loadTestData.getStatus();
        this.createdAt = loadTestData.getCreatedAt();
        this.deletedAt = loadTestData.getDeletedAt();
        if(runLog!=null){
            this.config = runLog.getConfig();
            this.startedAt = runLog.getStartedAt();
            this.completedAt = runLog.getCompletedAt();
            this.totalRequests = runLog.getTotalRequests();
            this.failedRequests = runLog.getFailedRequests();
        }
    }

    private UUID id;
    private String name;
    private LoadTestDataDTO associatedLoadTestData;
    private LoadTestStatus status;
    private Instant createdAt;
    private LoadTestRunLogConfig config;
    private Instant startedAt;
    private Instant completedAt;
    private Instant deletedAt;
    private Long totalRequests;
    private Long failedRequests;

}
