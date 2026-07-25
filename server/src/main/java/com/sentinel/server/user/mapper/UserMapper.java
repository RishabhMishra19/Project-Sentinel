package com.sentinel.server.user.mapper;

import com.sentinel.server.common.dto.response.UserBriefResponse;
import com.sentinel.server.role.mapper.RoleMapper;
import com.sentinel.server.user.dto.response.CreateUserResponse;
import com.sentinel.server.user.dto.response.UserResponse;
import com.sentinel.server.user.entity.User;
import java.util.Comparator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

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
