package com.sentinel.api.role.dto.response;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.api.role.entity.RoleStatus;

import java.time.Instant;

public record RoleResponse(
    String id,
    String name,
    RoleStatus status,
    UserBriefResponse createdBy,
    UserBriefResponse updatedBy,
    Instant createdAt,
    Instant updatedAt) {
}
