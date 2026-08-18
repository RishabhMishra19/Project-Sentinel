package com.sentinel.api.product.dto.response;

import com.sentinel.server.common.dto.response.UserBriefResponse;
import com.sentinel.server.product.entity.ProductStatus;
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
