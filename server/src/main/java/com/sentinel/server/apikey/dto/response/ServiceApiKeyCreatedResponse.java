package com.sentinel.server.apikey.dto.response;

import com.sentinel.server.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.server.common.dto.response.UserBriefResponse;
import java.time.Instant;

public record ServiceApiKeyCreatedResponse(
        String id,
        String serviceId,
        String name,
        ServiceApiKeyStatus status,
        UserBriefResponse createdBy,
        UserBriefResponse updatedBy,
        Instant createdAt,
        Instant updatedAt,
        Instant revokedAt,
        String apiKey) {
}
