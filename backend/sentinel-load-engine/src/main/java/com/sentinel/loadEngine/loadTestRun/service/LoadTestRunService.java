package com.sentinel.loadEngine.loadTestRun.service;

import com.sentinel.loadEngine.requestExecutor.dto.request.RunLoadTestRequest;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;

import java.util.UUID;

public interface LoadTestRunService {

    LoadTestRunLog create(UUID loadTestDataId, RunLoadTestRequest request);

    LoadTestRunLog getById(UUID id);

    LoadTestRunLog markCompleted(UUID id);

    LoadTestRunLog getLatestRunLogByDataId(UUID loadTestDataId);

}
