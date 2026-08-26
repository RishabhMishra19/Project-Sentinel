package com.sentinel.loadEngine.loadTestData.service;

import com.sentinel.loadEngine.loadTestData.dto.LoadTestDataWithLatestRun;
import com.sentinel.loadEngine.requestExecutor.dto.request.GenerateLoadTestDataRequest;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;

import java.util.List;
import java.util.UUID;

public interface LoadTestDataService {

    LoadTestData create(GenerateLoadTestDataRequest request);

    LoadTestData getById(UUID id);

    LoadTestData markRunning(UUID id);

    LoadTestData markIdle(UUID id);

    void deleteDataById(UUID id);

    List<LoadTestDataWithLatestRun> findLoadTestDataWithLatestRuns();

}
