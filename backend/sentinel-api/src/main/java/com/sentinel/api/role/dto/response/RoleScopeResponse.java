package com.sentinel.api.role.dto.response;

import com.sentinel.common.postgresql.permission.PermissionType;
import com.sentinel.common.postgresql.role.RoleScopeStatus;
import com.sentinel.common.postgresql.role.RoleScopeType;

public record RoleScopeResponse(
    String id,
    RoleScopeType scopeType,
    String scopeId,
    String scopeName,
    PermissionType permission,
    RoleScopeStatus status) {
}
