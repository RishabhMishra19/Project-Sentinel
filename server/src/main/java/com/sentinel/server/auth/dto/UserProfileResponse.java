package com.sentinel.server.auth.dto;

import com.sentinel.server.user.entity.UserStatus;
import java.time.Instant;

public record UserProfileResponse(
        String id,
        String email,
        String displayName,
        UserStatus status,
        boolean sentinelAdmin,
        Instant createdAt,
        Instant updatedAt,
        Instant lastLoginAt) {
}
