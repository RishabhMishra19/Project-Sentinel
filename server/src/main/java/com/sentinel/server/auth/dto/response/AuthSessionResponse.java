package com.sentinel.server.auth.dto.response;

import com.sentinel.server.auth.dto.response.common.RoleSummaryResponse;
import com.sentinel.server.auth.dto.response.common.TenantSummaryResponse;

import java.time.Instant;
import java.util.List;

public record AuthSessionResponse(String accessToken, Instant expiresAt, User user) {

    public record User(
            String id,
            String email,
            String name,
            boolean sentinelAdmin,
            boolean tenantAdmin,
            List<RoleSummaryResponse> roles,
            TenantSummaryResponse tenant) {}
}
