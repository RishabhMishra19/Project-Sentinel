package com.sentinel.api.user.service.core;

import com.sentinel.api.role.entity.Role;
import com.sentinel.api.tenant.entity.Tenant;
import com.sentinel.api.user.entity.User;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface UserService {

    User getById(UUID id);

    User findActiveByEmailWithAuthorities(String email);

    User findByIdWithAuthorities(UUID id);

    User recordLastLogin(User user);

    User updatePasswordHash(UUID userId, String newPasswordHash);

    Page<User> findAll(Specification<User> spec, Pageable pageable);

    User getByIdForTenant(UUID tenantId, UUID id);

    boolean existsByEmailIgnoreCase(String email);

    User create(
            String email, String displayName, String passwordHash, Tenant tenant, boolean tenantAdmin);

    User updateDisplayName(User user, String displayName);

    User markInactive(User user);

    User assignRole(User user, Role role);
}
