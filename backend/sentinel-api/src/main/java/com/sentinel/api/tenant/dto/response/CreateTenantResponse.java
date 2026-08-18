package com.sentinel.api.tenant.dto.response;

import com.sentinel.server.common.dto.response.UserBriefResponse;
import com.sentinel.server.tenant.entity.TenantStatus;
import java.time.Instant;
import java.util.List;

public record CreateTenantResponse(
        String id,
        String name,
        String slug,
        TenantStatus status,
        List<String> adminEmails,
        UserBriefResponse createdBy,
        UserBriefResponse updatedBy,
        Instant createdAt,
        Instant updatedAt,
        AdminSummary admin,
        String temporaryPassword) {

    public record AdminSummary(String id, String email, String displayName, boolean tenantAdmin) {}
}
