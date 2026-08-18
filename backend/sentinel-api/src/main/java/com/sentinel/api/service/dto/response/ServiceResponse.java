package com.sentinel.api.service.dto.response;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.api.service.entity.ServiceStatus;
import java.time.Instant;

public record ServiceResponse(
        String id,
        String productId,
        String productName,
        String name,
        ServiceStatus status,
        UserBriefResponse createdBy,
        UserBriefResponse updatedBy,
        Instant createdAt,
        Instant updatedAt) {
}
