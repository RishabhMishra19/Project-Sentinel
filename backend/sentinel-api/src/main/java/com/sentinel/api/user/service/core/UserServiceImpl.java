package com.sentinel.api.user.service.core;

import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.exception.UnauthorizedException;
import com.sentinel.api.role.entity.Role;
import com.sentinel.api.tenant.entity.Tenant;
import com.sentinel.api.user.entity.User;
import com.sentinel.api.user.entity.UserStatus;
import com.sentinel.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public User getById(UUID id) {
        return userRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public User findActiveByEmailWithAuthorities(String email) {
        User user = userRepository
            .findByEmailWithRolesAndPermissions(email)
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive");
        }
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public User findByIdWithAuthorities(UUID id) {
        User user = userRepository
            .findByIdWithRolesAndPermissions(id)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive");
        }
        return user;
    }

    @Override
    public User recordLastLogin(User user) {
        user.setLastLoginAt(Instant.now());
        return userRepository.save(user);
    }

    @Override
    public User updatePasswordHash(UUID userId, String newPasswordHash) {
        User user = userRepository
            .findById(userId)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive");
        }
        user.setPasswordHash(newPasswordHash);
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<User> findAll(Specification<User> spec, Pageable pageable) {
        return userRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public User getByIdForTenant(UUID tenantId, UUID id) {
        return userRepository
            .findWithRolesByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmailIgnoreCase(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    @Override
    public User create(
        String email, String displayName, String passwordHash, Tenant tenant, boolean tenantAdmin) {
        User user = new User();
        user.setEmail(email);
        user.setDisplayName(displayName);
        user.setPasswordHash(passwordHash);
        user.setStatus(UserStatus.ACTIVE);
        user.setSentinelAdmin(false);
        user.setTenantAdmin(tenantAdmin);
        user.setTenant(tenant);
        return userRepository.save(user);
    }

    @Override
    public User updateDisplayName(User user, String displayName) {
        user.setDisplayName(displayName);
        return userRepository.save(user);
    }

    @Override
    public User markInactive(User user) {
        user.setStatus(UserStatus.INACTIVE);
        return userRepository.save(user);
    }

    @Override
    public User assignRole(User user, Role role) {
        user.getRoles().add(role);
        return userRepository.save(user);
    }
}
