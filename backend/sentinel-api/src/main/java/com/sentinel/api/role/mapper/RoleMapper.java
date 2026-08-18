package com.sentinel.api.role.mapper;

import com.sentinel.server.common.dto.response.UserBriefResponse;
import com.sentinel.server.role.dto.response.RoleBriefResponse;
import com.sentinel.server.role.dto.response.RoleResponse;
import com.sentinel.server.role.dto.response.RoleScopeResponse;
import com.sentinel.server.role.entity.Role;
import com.sentinel.server.role.entity.RoleScope;
import com.sentinel.server.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

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

    private static UserBriefResponse toUserBrief(User user) {
        return new UserBriefResponse(
                user.getId().toString(), user.getDisplayName(), user.getEmail());
    }
}
