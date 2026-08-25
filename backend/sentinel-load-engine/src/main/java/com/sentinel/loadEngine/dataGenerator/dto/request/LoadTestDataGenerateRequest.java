package com.sentinel.loadEngine.dataGenerator.dto.request;

public record LoadTestDataGenerateRequest(
    String prefix,
    int tenantCount,
    int productsPerTenant,
    int servicesPerProduct
) {}
