package com.sentinel.loadEngine.requestExecutor.service.impl;

import com.sentinel.loadEngine.engine.LoadExecutor;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestData.service.LoadTestDataService;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import com.sentinel.loadEngine.loadTestRun.service.LoadTestRunService;
import com.sentinel.loadEngine.requestExecutor.dto.request.GenerateLoadTestDataRequest;
import com.sentinel.loadEngine.requestExecutor.dto.request.RunLoadTestRequest;
import com.sentinel.loadEngine.requestExecutor.dto.response.LoadTestResponse;
import com.sentinel.loadEngine.requestExecutor.service.RequestExecutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class RequestExecutorServiceImpl implements RequestExecutorService {

    private final LoadTestDataService loadTestDataService;
    private final LoadTestRunService loadTestRunService;
    private final LoadExecutor loadExecutor;


    @Override
    @Transactional
    public UUID generateLoadTestData(GenerateLoadTestDataRequest request) {
        return loadTestDataService.create(request).getId();
    }

    @Override
    @Transactional
    public LoadTestResponse startLoadTest(UUID loadTestDataId, RunLoadTestRequest request) {
        LoadTestRunLog runLog = loadTestRunService.getLatestRunLogByDataId(loadTestDataId);
        if (runLog != null && runLog.getCompletedAt() == null) {
            throw new RuntimeException("Load test run log already exists: " + loadTestDataId);
        }
        runLog = loadTestRunService.create(loadTestDataId, request);
        LoadTestData loadTestData = loadTestDataService.markRunning(loadTestDataId);
        LoadTestRunLog finalRunLog = runLog;
        Thread.ofVirtual().start(() -> {
            loadExecutor.execute(loadTestData, finalRunLog);
        });
        return new LoadTestResponse(loadTestData, runLog);
    }

    @Override
    @Transactional
    public LoadTestResponse stopLoadTest(UUID loadTestDataId) {
        LoadTestRunLog runLog = loadTestRunService.getLatestRunLogByDataId(loadTestDataId);
        if (runLog == null) {
            throw new RuntimeException("No Load test is running for dataID: " + loadTestDataId);
        }
        runLog = loadTestRunService.markCompleted(runLog.getId());
        LoadTestData loadTestData = loadTestDataService.markIdle(loadTestDataId);
        loadExecutor.cancelRun();
        return new LoadTestResponse(loadTestData, runLog);
    }

    @Override
    public LoadTestResponse getLoadTestByDataId(UUID loadTestDataId) {
        LoadTestData loadTestData = loadTestDataService.getById(loadTestDataId);
        LoadTestRunLog runLog = loadTestRunService.getLatestRunLogByDataId(loadTestDataId);
        return new LoadTestResponse(loadTestData, runLog);
    }

    @Override
    @Transactional
    public Boolean deleteLoadTestData(UUID loadTestDataId) {
        LoadTestRunLog runLog = loadTestRunService.getLatestRunLogByDataId(loadTestDataId);
        if (runLog != null && runLog.getCompletedAt() == null) {
            throw new RuntimeException("Load test is running for dataID: " + loadTestDataId);
        }
        loadTestDataService.deleteDataById(loadTestDataId);
        return true;
    }

    @Override
    public List<LoadTestResponse> getLoadTestList() {
        return loadTestDataService.findLoadTestDataWithLatestRuns().stream().map(v -> new LoadTestResponse(v.loadTestData(), v.latestRun()))
            .toList();
    }
}
