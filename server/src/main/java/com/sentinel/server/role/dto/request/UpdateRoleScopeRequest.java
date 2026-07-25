package com.sentinel.server.role.dto.request;

import com.sentinel.server.permission.entity.PermissionType;
import jakarta.validation.constraints.NotNull;

public record UpdateRoleScopeRequest(@NotNull PermissionType permission) {}
