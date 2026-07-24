package com.sentinel.server.auth.mapper;

import com.sentinel.server.auth.dto.MeResponse;
import com.sentinel.server.auth.dto.PermissionSummaryResponse;
import com.sentinel.server.auth.dto.ProfileResponse;
import com.sentinel.server.auth.dto.RoleSummaryResponse;
import com.sentinel.server.auth.dto.UserProfileResponse;
import com.sentinel.server.auth.dto.UserSummaryResponse;
import com.sentinel.server.permission.entity.Permission;
import com.sentinel.server.permission.entity.PermissionStatus;
import com.sentinel.server.role.entity.Role;
import com.sentinel.server.role.entity.RoleStatus;
import com.sentinel.server.user.entity.User;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public UserSummaryResponse toUserSummary(User user) {
        return new UserSummaryResponse(user.getId().toString(), user.getEmail(), user.getDisplayName());
    }

    public MeResponse toMeResponse(User user) {
        return new MeResponse(toUserSummary(user), toActiveRoleSummaries(user));
    }

    public UserProfileResponse toUserProfile(User user) {
        return new UserProfileResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getDisplayName(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLoginAt());
    }

    public ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(toUserProfile(user), toActiveRoleSummaries(user));
    }

    private List<RoleSummaryResponse> toActiveRoleSummaries(User user) {
        return user.getRoles().stream()
                .filter(role -> role.getStatus() == RoleStatus.ACTIVE)
                .map(this::toRoleSummary)
                .toList();
    }

    public RoleSummaryResponse toRoleSummary(Role role) {
        List<PermissionSummaryResponse> permissions = role.getPermissions().stream()
                .filter(permission -> permission.getStatus() == PermissionStatus.ACTIVE)
                .map(this::toPermissionSummary)
                .toList();
        return new RoleSummaryResponse(role.getId().toString(), role.getName(), permissions);
    }

    public PermissionSummaryResponse toPermissionSummary(Permission permission) {
        return new PermissionSummaryResponse(permission.getId().toString(), permission.getName());
    }
}
