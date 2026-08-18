package com.sentinel.api.auth.mapper;

import com.sentinel.server.auth.dto.response.AuthSessionResponse;
import com.sentinel.server.auth.dto.response.ProfileResponse;
import com.sentinel.server.auth.dto.response.common.RoleSummaryResponse;
import com.sentinel.server.auth.dto.response.common.TenantSummaryResponse;
import com.sentinel.server.role.entity.Role;
import com.sentinel.server.role.entity.RoleScope;
import com.sentinel.server.role.entity.RoleScopeStatus;
import com.sentinel.server.role.entity.RoleStatus;
import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.user.entity.User;

import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public TenantSummaryResponse toTenantSummary(Tenant tenant) {
        if (tenant == null) {
            return null;
        }
        return new TenantSummaryResponse(tenant.getId().toString(), tenant.getName());
    }

    public AuthSessionResponse toAuthSessionResponse(String accessToken, long expiresIn, User user) {
        return new AuthSessionResponse(
                accessToken,
                DateUtils.addSeconds(new Date(), Math.toIntExact(expiresIn)).toInstant(),
                new AuthSessionResponse.User(
                        user.getId().toString(),
                        user.getEmail(),
                        user.getDisplayName(),
                        user.isSentinelAdmin(),
                        user.isTenantAdmin(),
                        toActiveRoleSummaries(user),
                        toTenantSummary(user.getTenant())));
    }

    public ProfileResponse toProfileResponse(User user) {
        return new ProfileResponse(
                user.getId().toString(),
                user.getEmail(),
                user.getDisplayName(),
                user.isSentinelAdmin(),
                user.isTenantAdmin(),
                toActiveRoleSummaries(user),
                toTenantSummary(user.getTenant()),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLoginAt());
    }

    private List<RoleSummaryResponse> toActiveRoleSummaries(User user) {
        return user.getRoles().stream()
                .filter(role -> role.getStatus() == RoleStatus.ACTIVE)
                .map(this::toRoleSummary)
                .toList();
    }

    public RoleSummaryResponse toRoleSummary(Role role) {
        List<RoleSummaryResponse.Scope> scopes = role.getRoleScopes().stream()
                .filter(scope -> scope.getStatus() == RoleScopeStatus.ACTIVE)
                .map(this::toScopeSummary)
                .toList();
        return new RoleSummaryResponse(role.getId().toString(), role.getName(), scopes);
    }

    public RoleSummaryResponse.Scope toScopeSummary(RoleScope scope) {
        return new RoleSummaryResponse.Scope(
                scope.getId().toString(),
                scope.getScopeType().name(),
                scope.getScopeId() != null ? scope.getScopeId().toString() : null,
                scope.getPermission().name());
    }
}
