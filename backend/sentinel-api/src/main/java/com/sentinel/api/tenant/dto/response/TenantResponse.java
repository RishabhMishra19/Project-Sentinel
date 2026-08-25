package com.sentinel.api.tenant.dto.response;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.common.postgresql.tenant.TenantStatus;

import java.time.Instant;
import java.util.List;

public record TenantResponse(
    String id,
    String name,
    String slug,
    TenantStatus status,
    List<String> adminEmails,
    UserBriefResponse createdBy,
    UserBriefResponse updatedBy,
    Instant createdAt,
    Instant updatedAt) {
}
