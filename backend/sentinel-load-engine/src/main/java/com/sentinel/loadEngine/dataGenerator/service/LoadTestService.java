package com.sentinel.loadEngine.dataGenerator.service;

import com.sentinel.loadEngine.dataGenerator.dto.request.LoadTestDataGenerateRequest;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestDataGenerationResponse;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestRelatedEntities;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestResponse;

import java.util.UUID;

public interface LoadTestService {

    LoadTestDataGenerationResponse generate(LoadTestDataGenerateRequest request);

    LoadTestRelatedEntities getRelatedEntitiesByLoadTestId(UUID loadTestId);

    LoadTestResponse getById(UUID loadTestId);


    boolean deleteById(UUID loadTestId);
}
