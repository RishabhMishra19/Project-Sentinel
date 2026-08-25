package com.sentinel.loadEngine.dataGenerator.dto.response;

public record LoadTestDataGenerationResponse(
    String testDataId,
    String prefix,
    int tenantsCreated,
    int productsCreated,
    int servicesCreated
) {}
