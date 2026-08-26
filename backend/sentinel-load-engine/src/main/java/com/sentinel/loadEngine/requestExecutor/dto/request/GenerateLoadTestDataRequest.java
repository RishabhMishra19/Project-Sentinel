package com.sentinel.loadEngine.requestExecutor.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

public record GenerateLoadTestDataRequest(
    @NotEmpty() String name,
    @Min(1) int tenantCount,
    @Min(1) int productsPerTenant,
    @Min(1) int servicesPerProduct,
    @Min(1) int endpointsPerService
) {
}
