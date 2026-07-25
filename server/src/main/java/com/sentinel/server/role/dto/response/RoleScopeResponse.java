package com.sentinel.server.role.dto.response;

import com.sentinel.server.permission.entity.PermissionType;
import com.sentinel.server.role.entity.RoleScopeStatus;
import com.sentinel.server.role.entity.RoleScopeType;

public record RoleScopeResponse(
        String id,
        RoleScopeType scopeType,
        String scopeId,
        String scopeName,
        PermissionType permission,
        RoleScopeStatus status) {}
