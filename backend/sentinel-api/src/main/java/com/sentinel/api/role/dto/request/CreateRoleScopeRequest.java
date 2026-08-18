package com.sentinel.api.role.dto.request;

import com.sentinel.server.permission.entity.PermissionType;
import com.sentinel.server.role.entity.RoleScopeType;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CreateRoleScopeRequest(
        @NotNull RoleScopeType scopeType,
        @NotNull UUID scopeId,
        @NotNull PermissionType permission) {}
