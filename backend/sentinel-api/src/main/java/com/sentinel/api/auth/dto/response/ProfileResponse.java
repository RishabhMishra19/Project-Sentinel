package com.sentinel.api.auth.dto.response;

import com.sentinel.api.auth.dto.response.common.RoleSummaryResponse;
import com.sentinel.api.auth.dto.response.common.TenantSummaryResponse;
import com.sentinel.api.user.entity.UserStatus;
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
        boolean tenantAdmin,
        List<RoleSummaryResponse> roles,
        TenantSummaryResponse tenant,
        UserStatus status,
        Instant createdAt,
        Instant updatedAt,
        Instant lastLoginAt) {}
