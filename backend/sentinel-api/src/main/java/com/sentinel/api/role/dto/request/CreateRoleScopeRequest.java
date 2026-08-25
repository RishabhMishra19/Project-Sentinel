package com.sentinel.api.role.dto.request;

import com.sentinel.common.postgresql.permission.PermissionType;
import com.sentinel.common.postgresql.role.RoleScopeType;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateRoleScopeRequest(
    @NotNull RoleScopeType scopeType,
    @NotNull UUID scopeId,
    @NotNull PermissionType permission) {
}
