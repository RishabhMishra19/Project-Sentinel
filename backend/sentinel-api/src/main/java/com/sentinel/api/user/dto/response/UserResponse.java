package com.sentinel.api.user.dto.response;

import com.sentinel.api.role.dto.response.RoleBriefResponse;
import com.sentinel.common.postgresql.user.entity.UserStatus;

import java.time.Instant;
import java.util.List;

public record UserResponse(
    String id,
    String email,
    String displayName,
    UserStatus status,
    boolean tenantAdmin,
    List<RoleBriefResponse> roles,
    Instant createdAt,
    Instant updatedAt,
    Instant lastLoginAt) {
}
