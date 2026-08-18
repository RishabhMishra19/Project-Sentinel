package com.sentinel.api.user.service;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ConflictException;
import com.sentinel.api.common.exception.ForbiddenException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.api.role.entity.Role;
import com.sentinel.api.role.service.core.RoleService;
import com.sentinel.api.tenant.entity.Tenant;
import com.sentinel.api.tenant.repository.TenantRepository;
import com.sentinel.api.user.dto.request.AssignRoleRequest;
import com.sentinel.api.user.dto.request.CreateUserRequest;
import com.sentinel.api.user.dto.request.UpdateUserRequest;
import com.sentinel.api.user.dto.response.CreateUserResponse;
import com.sentinel.api.user.dto.response.UserResponse;
import com.sentinel.api.user.entity.User;
import com.sentinel.api.user.entity.UserStatus;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.user.mapper.UserMapper;
import com.sentinel.api.user.repository.UserSpecifications;
import com.sentinel.api.user.service.core.UserService;
import java.security.SecureRandom;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserFacadeImpl implements UserFacade {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final int TEMP_PASSWORD_LENGTH = 16;
    private static final String TEMP_PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserService userService;
    private final RoleService roleService;
    private final UserMapper userMapper;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> list(UUID tenantId, ListQueryRequest query) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Pageable effective =
                query.toPageable(UserSpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Specification<User> spec = UserSpecifications.withFilters(effectiveTenantId, query);
        Page<User> page = userService.findAll(spec, effective);
        return PageResponse.from(page.map(userMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(UUID tenantId, UUID id) {
        return userMapper.toResponse(userService.getByIdForTenant(requireTenantId(tenantId), id));
    }

    @Override
    public CreateUserResponse create(UUID tenantId, CreateUserRequest request) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        String email = request.email().trim().toLowerCase();
        String displayName = request.displayName().trim();
        if (userService.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Email already exists");
        }
        Tenant tenantRef = tenantRepository.getReferenceById(effectiveTenantId);
        String temporaryPassword = generateTemporaryPassword();
        User saved = userService.create(
                email,
                displayName,
                passwordEncoder.encode(temporaryPassword),
                tenantRef,
                false);
        User withRoles = userService.getByIdForTenant(effectiveTenantId, saved.getId());
        return userMapper.toCreateResponse(withRoles, temporaryPassword);
    }

    @Override
    public UserResponse update(UUID tenantId, UUID id, UpdateUserRequest request) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        User user = userService.getByIdForTenant(effectiveTenantId, id);
        ensureTenantUser(user);
        userService.updateDisplayName(user, request.displayName().trim());
        return userMapper.toResponse(userService.getByIdForTenant(effectiveTenantId, id));
    }

    @Override
    public UserResponse assignRole(UUID tenantId, UUID id, AssignRoleRequest request) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        User user = userService.getByIdForTenant(effectiveTenantId, id);
        ensureTenantUser(user);
        Role role = roleService.getByIdForTenant(effectiveTenantId, request.roleId());
        userService.assignRole(user, role);
        return userMapper.toResponse(userService.getByIdForTenant(effectiveTenantId, id));
    }

    @Override
    public void markInactive(UUID tenantId, UUID id, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        if (id.equals(actorId)) {
            throw new ForbiddenException("Cannot mark yourself inactive");
        }
        User user = userService.getByIdForTenant(effectiveTenantId, id);
        ensureTenantUser(user);
        if (user.getStatus() == UserStatus.INACTIVE) {
            return;
        }
        userService.markInactive(user);
    }

    private void ensureTenantUser(User user) {
        if (user.isSentinelAdmin() || user.getTenant() == null) {
            throw new ResourceNotFoundException("User not found");
        }
    }

    private UUID requireTenantId(UUID tenantId) {
        if (tenantId == null) {
            throw new BadRequestException("Active tenant is required");
        }
        return tenantId;
    }

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(TEMP_PASSWORD_LENGTH);
        for (int i = 0; i < TEMP_PASSWORD_LENGTH; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(SECURE_RANDOM.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
