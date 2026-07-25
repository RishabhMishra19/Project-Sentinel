package com.sentinel.server.tenant.dto.response;

import com.sentinel.server.common.dto.response.UserBriefResponse;
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
