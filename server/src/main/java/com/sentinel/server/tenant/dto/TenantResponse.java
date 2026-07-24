package com.sentinel.server.tenant.dto;

import com.sentinel.server.common.dto.UserBriefResponse;
import com.sentinel.server.tenant.entity.TenantStatus;
import java.time.Instant;

public record TenantResponse(
        String id,
        String name,
        String slug,
        TenantStatus status,
        UserBriefResponse createdBy,
        UserBriefResponse updatedBy,
        Instant createdAt,
        Instant updatedAt) {
}
