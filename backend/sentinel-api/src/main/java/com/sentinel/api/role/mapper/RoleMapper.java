package com.sentinel.api.role.mapper;

import com.sentinel.api.common.dto.response.UserBriefResponse;
import com.sentinel.api.role.dto.response.RoleBriefResponse;
import com.sentinel.api.role.dto.response.RoleResponse;
import com.sentinel.api.role.dto.response.RoleScopeResponse;
import com.sentinel.common.postgresql.role.entity.Role;
import com.sentinel.common.postgresql.role.entity.RoleScope;
import com.sentinel.common.postgresql.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    private static UserBriefResponse toUserBrief(User user) {
        return new UserBriefResponse(
            user.getId().toString(), user.getDisplayName(), user.getEmail());
    }

    public RoleBriefResponse toBrief(Role role) {
        return new RoleBriefResponse(role.getId().toString(), role.getName());
    }

    public RoleResponse toResponse(Role role) {
        return new RoleResponse(
            role.getId().toString(),
            role.getName(),
            role.getStatus(),
            toUserBrief(role.getCreatedBy()),
            toUserBrief(role.getUpdatedBy()),
            role.getCreatedAt(),
            role.getUpdatedAt());
    }

    public RoleScopeResponse toScopeResponse(RoleScope scope, String scopeName) {
        return new RoleScopeResponse(
            scope.getId().toString(),
            scope.getScopeType(),
            scope.getScopeId().toString(),
            scopeName,
            scope.getPermission(),
            scope.getStatus());
    }
}
