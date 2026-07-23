package com.sentinel.server.auth.mapper;

import com.sentinel.server.auth.dto.MeResponse;
import com.sentinel.server.auth.dto.PermissionSummaryResponse;
import com.sentinel.server.auth.dto.RoleSummaryResponse;
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
        List<RoleSummaryResponse> roles = user.getRoles().stream()
                .filter(role -> role.getStatus() == RoleStatus.ACTIVE)
                .map(this::toRoleSummary)
                .toList();
        return new MeResponse(toUserSummary(user), roles);
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
