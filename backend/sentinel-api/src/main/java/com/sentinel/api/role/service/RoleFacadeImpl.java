package com.sentinel.api.role.service;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ConflictException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.product.service.core.ProductService;
import com.sentinel.api.role.dto.request.CreateRoleRequest;
import com.sentinel.api.role.dto.request.CreateRoleScopeRequest;
import com.sentinel.api.role.dto.request.UpdateRoleRequest;
import com.sentinel.api.role.dto.request.UpdateRoleScopeRequest;
import com.sentinel.api.role.dto.response.RoleResponse;
import com.sentinel.api.role.dto.response.RoleScopeResponse;
import com.sentinel.common.postgresql.role.Role;
import com.sentinel.common.postgresql.role.RoleScope;
import com.sentinel.common.postgresql.role.RoleScopeStatus;
import com.sentinel.common.postgresql.role.RoleScopeType;
import com.sentinel.common.postgresql.role.RoleStatus;
import com.sentinel.api.role.mapper.RoleMapper;
import com.sentinel.api.role.service.core.RoleScopeService;
import com.sentinel.api.role.service.core.RoleService;
import com.sentinel.api.service.service.core.ServiceService;
import com.sentinel.common.postgresql.tenant.Tenant;
import com.sentinel.api.tenant.repository.TenantRepository;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleFacadeImpl implements RoleFacade {

    private final RoleService roleService;
    private final RoleScopeService roleScopeService;
    private final RoleMapper roleMapper;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final ProductService productService;
    private final ServiceService serviceService;

    private static UUID requireActiveTenant(UUID tenantId) {
        if (tenantId == null) {
            throw new BadRequestException("Active tenant is required");
        }
        return tenantId;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> list(UUID tenantId) {
        requireActiveTenant(tenantId);
        return roleService.listByTenant(tenantId).stream()
            .map(roleMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getById(UUID tenantId, UUID id) {
        requireActiveTenant(tenantId);
        return roleMapper.toResponse(roleService.getByIdForTenant(tenantId, id));
    }

    @Override
    public RoleResponse create(UUID tenantId, CreateRoleRequest request, UUID actorId) {
        UUID effectiveTenantId = requireActiveTenant(tenantId);
        String name = request.name().trim();
        if (roleService.existsByTenantIdAndNameIgnoreCase(effectiveTenantId, name)) {
            throw new ConflictException("Role name already exists in this tenant");
        }
        Tenant tenantRef = tenantRepository.getReferenceById(effectiveTenantId);
        User actorRef = userRepository.getReferenceById(actorId);
        Role saved = roleService.create(tenantRef, name, actorRef);
        return roleMapper.toResponse(roleService.getByIdForTenant(effectiveTenantId, saved.getId()));
    }

    @Override
    public RoleResponse update(
        UUID tenantId, UUID id, UpdateRoleRequest request, UUID actorId) {
        UUID effectiveTenantId = requireActiveTenant(tenantId);
        Role role = roleService.getByIdForTenant(effectiveTenantId, id);
        if (role.getStatus() == RoleStatus.INACTIVE) {
            throw new BadRequestException("Cannot update an inactive role");
        }
        String name = request.name().trim();
        if (roleService.existsByTenantIdAndNameIgnoreCaseAndIdNot(
            effectiveTenantId, name, id)) {
            throw new ConflictException("Role name already exists in this tenant");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        roleService.updateName(role, name, actorRef);
        return roleMapper.toResponse(roleService.getByIdForTenant(effectiveTenantId, id));
    }

    @Override
    public void markInactive(UUID tenantId, UUID id, UUID actorId) {
        UUID effectiveTenantId = requireActiveTenant(tenantId);
        Role role = roleService.getByIdForTenant(effectiveTenantId, id);
        if (role.getStatus() == RoleStatus.INACTIVE) {
            throw new BadRequestException("Role is already inactive");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        roleService.markInactive(role, actorRef);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleScopeResponse> listScopes(UUID tenantId, UUID roleId) {
        requireActiveTenant(tenantId);
        return roleScopeService.listByRoleIdForTenant(tenantId, roleId).stream()
            .map(scope -> roleMapper.toScopeResponse(scope, resolveScopeName(tenantId, scope)))
            .toList();
    }

    @Override
    public RoleScopeResponse createScope(
        UUID tenantId, UUID roleId, CreateRoleScopeRequest request, UUID actorId) {
        UUID effectiveTenantId = requireActiveTenant(tenantId);
        Role role = roleService.getByIdForTenant(effectiveTenantId, roleId);
        if (role.getStatus() == RoleStatus.INACTIVE) {
            throw new BadRequestException("Cannot add scopes to an inactive role");
        }
        RoleScopeType scopeType = request.scopeType();
        UUID scopeId = request.scopeId();

        validateResourceScope(effectiveTenantId, scopeType, scopeId);
        if (roleScopeService.existsResourceScope(roleId, scopeType, scopeId)) {
            throw new ConflictException("This scope already exists on the role");
        }

        User actorRef = userRepository.getReferenceById(actorId);
        RoleScope saved =
            roleScopeService.create(role, scopeType, scopeId, request.permission(), actorRef);
        return roleMapper.toScopeResponse(
            saved, resolveScopeName(effectiveTenantId, scopeType, scopeId));
    }

    @Override
    public RoleScopeResponse updateScope(
        UUID tenantId,
        UUID roleId,
        UUID scopeId,
        UpdateRoleScopeRequest request,
        UUID actorId) {
        UUID effectiveTenantId = requireActiveTenant(tenantId);
        RoleScope scope = roleScopeService.getByIdForRole(effectiveTenantId, roleId, scopeId);
        if (scope.getStatus() == RoleScopeStatus.INACTIVE) {
            throw new BadRequestException("Cannot update an inactive scope");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        RoleScope saved =
            roleScopeService.updatePermission(scope, request.permission(), actorRef);
        return roleMapper.toScopeResponse(
            saved, resolveScopeName(effectiveTenantId, saved));
    }

    @Override
    public void deactivateScope(UUID tenantId, UUID roleId, UUID scopeId, UUID actorId) {
        UUID effectiveTenantId = requireActiveTenant(tenantId);
        RoleScope scope = roleScopeService.getByIdForRole(effectiveTenantId, roleId, scopeId);
        if (scope.getStatus() == RoleScopeStatus.INACTIVE) {
            throw new BadRequestException("Scope is already inactive");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        roleScopeService.markInactive(scope, actorRef);
    }

    private String resolveScopeName(UUID tenantId, RoleScope scope) {
        return resolveScopeName(tenantId, scope.getScopeType(), scope.getScopeId());
    }

    private String resolveScopeName(UUID tenantId, RoleScopeType scopeType, UUID scopeId) {
        if (scopeType == RoleScopeType.PRODUCT) {
            return productService
                .findWithAuditByIdAndTenantId(scopeId, tenantId)
                .map(product -> product.getName())
                .orElse("Unknown product");
        }
        if (scopeType == RoleScopeType.SERVICE) {
            return serviceService
                .findWithAuditById(scopeId)
                .filter(service ->
                    Objects.equals(service.getProduct().getTenant().getId(), tenantId))
                .map(service -> service.getName())
                .orElse("Unknown service");
        }
        return "—";
    }

    private void validateResourceScope(UUID tenantId, RoleScopeType scopeType, UUID scopeId) {
        if (scopeType == RoleScopeType.PRODUCT) {
            productService
                .findWithAuditByIdAndTenantId(scopeId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            return;
        }
        if (scopeType == RoleScopeType.SERVICE) {
            com.sentinel.api.service.entity.Service service = serviceService
                .findWithAuditById(scopeId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
            UUID serviceTenantId = service.getProduct().getTenant().getId();
            if (!Objects.equals(serviceTenantId, tenantId)) {
                throw new ResourceNotFoundException("Service not found");
            }
            return;
        }
        throw new BadRequestException("Unsupported scope type: " + scopeType);
    }
}
