package com.sentinel.api.security;

import com.sentinel.api.permission.entity.PermissionType;
import com.sentinel.api.role.entity.RoleScopeType;

import java.util.UUID;

/**
 * Active role-scope grant attached to the authenticated principal.
 */
public record ScopeGrant(RoleScopeType scopeType, UUID scopeId, PermissionType permission) {
}
