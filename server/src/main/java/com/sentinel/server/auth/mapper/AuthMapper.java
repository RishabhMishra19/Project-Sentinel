package com.sentinel.server.auth.mapper;

import com.sentinel.server.auth.dto.MeResponse;
import com.sentinel.server.auth.dto.ProfileResponse;
import com.sentinel.server.auth.dto.RoleScopeSummaryResponse;
import com.sentinel.server.auth.dto.RoleSummaryResponse;
import com.sentinel.server.auth.dto.UserProfileResponse;
import com.sentinel.server.auth.dto.UserSummaryResponse;
import com.sentinel.server.role.entity.Role;
import com.sentinel.server.role.entity.RoleScope;
import com.sentinel.server.role.entity.RoleScopeStatus;
import com.sentinel.server.role.entity.RoleStatus;
import com.sentinel.server.user.entity.User;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public UserSummaryResponse toUserSummary(User user) {
        return new UserSummaryResponse(
                user.getId().toString(), user.getEmail(), user.getDisplayName(), user.isSentinelAdmin());
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
                user.isSentinelAdmin(),
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
        List<RoleScopeSummaryResponse> scopes = role.getRoleScopes().stream()
                .filter(scope -> scope.getStatus() == RoleScopeStatus.ACTIVE)
                .map(this::toScopeSummary)
                .toList();
        return new RoleSummaryResponse(role.getId().toString(), role.getName(), scopes);
    }

    public RoleScopeSummaryResponse toScopeSummary(RoleScope scope) {
        return new RoleScopeSummaryResponse(
                scope.getId().toString(),
                scope.getScopeType().name(),
                scope.getScopeId() != null ? scope.getScopeId().toString() : null,
                scope.getPermission().name());
    }
}
