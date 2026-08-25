package com.sentinel.api.apikey.dto.response;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;

import java.time.Instant;

public record ServiceApiKeyResponse(
    String id,
    String serviceId,
    String name,
    ServiceApiKeyStatus status,
    UserBriefResponse createdBy,
    UserBriefResponse updatedBy,
    Instant createdAt,
    Instant updatedAt,
    Instant revokedAt) {
}
