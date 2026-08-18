package com.sentinel.api.role.dto.response;

import com.sentinel.api.permission.entity.PermissionType;
import com.sentinel.api.role.entity.RoleScopeStatus;
import com.sentinel.api.role.entity.RoleScopeType;

public record RoleScopeResponse(
        String id,
        RoleScopeType scopeType,
        String scopeId,
        String scopeName,
        PermissionType permission,
        RoleScopeStatus status) {}
