package com.sentinel.api.role.service.core;

import com.sentinel.api.permission.entity.PermissionType;
import com.sentinel.api.role.entity.Role;
import com.sentinel.api.role.entity.RoleScope;
import com.sentinel.api.role.entity.RoleScopeType;
import com.sentinel.api.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface RoleScopeService {

    List<RoleScope> listByRoleIdForTenant(UUID tenantId, UUID roleId);

    RoleScope getByIdForRole(UUID tenantId, UUID roleId, UUID scopeId);

    boolean existsResourceScope(UUID roleId, RoleScopeType scopeType, UUID scopeId);

    RoleScope create(
        Role role,
        RoleScopeType scopeType,
        UUID scopeId,
        PermissionType permission,
        User actor);

    RoleScope updatePermission(RoleScope scope, PermissionType permission, User actor);

    RoleScope markInactive(RoleScope scope, User actor);
}
