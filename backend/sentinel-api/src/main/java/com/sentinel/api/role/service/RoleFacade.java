package com.sentinel.api.role.service;

import com.sentinel.api.role.dto.request.CreateRoleRequest;
import com.sentinel.api.role.dto.request.CreateRoleScopeRequest;
import com.sentinel.api.role.dto.request.UpdateRoleRequest;
import com.sentinel.api.role.dto.request.UpdateRoleScopeRequest;
import com.sentinel.api.role.dto.response.RoleResponse;
import com.sentinel.api.role.dto.response.RoleScopeResponse;

import java.util.List;
import java.util.UUID;

public interface RoleFacade {

    List<RoleResponse> list(UUID tenantId);

    RoleResponse getById(UUID tenantId, UUID id);

    RoleResponse create(UUID tenantId, CreateRoleRequest request, UUID actorId);

    RoleResponse update(UUID tenantId, UUID id, UpdateRoleRequest request, UUID actorId);

    void markInactive(UUID tenantId, UUID id, UUID actorId);

    List<RoleScopeResponse> listScopes(UUID tenantId, UUID roleId);

    RoleScopeResponse createScope(
        UUID tenantId, UUID roleId, CreateRoleScopeRequest request, UUID actorId);

    RoleScopeResponse updateScope(
        UUID tenantId, UUID roleId, UUID scopeId, UpdateRoleScopeRequest request, UUID actorId);

    void deactivateScope(UUID tenantId, UUID roleId, UUID scopeId, UUID actorId);
}
