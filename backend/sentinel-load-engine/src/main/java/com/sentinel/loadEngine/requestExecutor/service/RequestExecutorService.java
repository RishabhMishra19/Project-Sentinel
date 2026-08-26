package com.sentinel.loadEngine.requestExecutor.service;

import com.sentinel.loadEngine.requestExecutor.dto.request.GenerateLoadTestDataRequest;
import com.sentinel.loadEngine.requestExecutor.dto.request.RunLoadTestRequest;
import com.sentinel.loadEngine.requestExecutor.dto.response.LoadTestResponse;

import java.util.UUID;

public interface RequestExecutorService {

    UUID generateLoadTestData(GenerateLoadTestDataRequest request);

    LoadTestResponse startLoadTest(UUID loadTestDataId, RunLoadTestRequest request);

    LoadTestResponse stopLoadTest(UUID loadTestDataId);

    LoadTestResponse getLoadTestByDataId(UUID loadTestDataId);

    Boolean deleteLoadTestData(UUID loadTestDataId);
}
