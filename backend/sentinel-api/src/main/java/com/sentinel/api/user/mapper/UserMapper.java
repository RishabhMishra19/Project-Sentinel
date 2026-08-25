package com.sentinel.api.user.mapper;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.api.role.mapper.RoleMapper;
import com.sentinel.api.user.dto.response.CreateUserResponse;
import com.sentinel.api.user.dto.response.UserResponse;
import com.sentinel.common.postgresql.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Comparator;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final RoleMapper roleMapper;

    public UserBriefResponse toBrief(User user) {
        return new UserBriefResponse(user.getId().toString(), user.getDisplayName(), user.getEmail());
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId().toString(),
            user.getEmail(),
            user.getDisplayName(),
            user.getStatus(),
            user.isTenantAdmin(),
            user.getRoles().stream()
                .sorted(Comparator.comparing(role -> role.getName().toLowerCase()))
                .map(roleMapper::toBrief)
                .toList(),
            user.getCreatedAt(),
            user.getUpdatedAt(),
            user.getLastLoginAt());
    }

    public CreateUserResponse toCreateResponse(User user, String temporaryPassword) {
        UserResponse base = toResponse(user);
        return new CreateUserResponse(
            base.id(),
            base.email(),
            base.displayName(),
            base.status(),
            base.tenantAdmin(),
            base.roles(),
            base.createdAt(),
            base.updatedAt(),
            base.lastLoginAt(),
            temporaryPassword);
    }
}
