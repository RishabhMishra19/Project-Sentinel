package com.sentinel.server.auth.dto.response;

import com.sentinel.server.auth.dto.response.common.RoleSummaryResponse;
import com.sentinel.server.auth.dto.response.common.TenantSummaryResponse;
import java.util.List;

public record AuthSessionResponse(String accessToken, long expiresIn, User user) {

    public record User(
            String id,
            String email,
            String name,
            boolean sentinelAdmin,
            List<RoleSummaryResponse> roles,
            TenantSummaryResponse tenant) {
    }
}
