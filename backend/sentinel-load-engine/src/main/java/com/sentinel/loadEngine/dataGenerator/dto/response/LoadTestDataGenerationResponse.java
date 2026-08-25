package com.sentinel.loadEngine.dataGenerator.dto.response;

import java.util.UUID;

public record LoadTestDataGenerationResponse(
    UUID testDataId,
    String prefix,
    int tenantsCreated,
    int productsCreated,
    int servicesCreated
) {}
