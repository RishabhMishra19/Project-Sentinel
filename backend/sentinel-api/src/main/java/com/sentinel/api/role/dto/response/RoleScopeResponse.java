package com.sentinel.api.role.dto.response;

import com.sentinel.common.postgresql.permission.entity.PermissionType;
import com.sentinel.common.postgresql.role.entity.RoleScopeStatus;
import com.sentinel.common.postgresql.role.entity.RoleScopeType;

public record RoleScopeResponse(
    String id,
    RoleScopeType scopeType,
    String scopeId,
    String scopeName,
    PermissionType permission,
    RoleScopeStatus status) {
}
