package com.sentinel.server.auth.dto.response;

import com.sentinel.server.auth.dto.response.common.RoleSummaryResponse;
import com.sentinel.server.auth.dto.response.common.TenantSummaryResponse;
import com.sentinel.server.user.entity.UserStatus;
import java.time.Instant;
import java.util.List;

/**
 * Profile view: same identity/authz fields as {@link AuthSessionResponse} (without tokens),
 * plus account metadata.
 */
public record ProfileResponse(
        String id,
        String email,
        String name,
        boolean sentinelAdmin,
        List<RoleSummaryResponse> roles,
        TenantSummaryResponse tenant,
        UserStatus status,
        Instant createdAt,
        Instant updatedAt,
        Instant lastLoginAt) {
}
