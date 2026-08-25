package com.sentinel.api.product.dto.response;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.api.product.entity.ProductStatus;

import java.time.Instant;

public record ProductResponse(
    String id,
    String tenantId,
    String name,
    ProductStatus status,
    UserBriefResponse createdBy,
    UserBriefResponse updatedBy,
    Instant createdAt,
    Instant updatedAt) {
}
