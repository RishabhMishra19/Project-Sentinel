package com.sentinel.server.role.dto.response;

import com.sentinel.server.common.dto.response.UserBriefResponse;
import com.sentinel.server.role.entity.RoleStatus;
import java.time.Instant;

public record RoleResponse(
        String id,
        String name,
        RoleStatus status,
        UserBriefResponse createdBy,
        UserBriefResponse updatedBy,
        Instant createdAt,
        Instant updatedAt) {}
