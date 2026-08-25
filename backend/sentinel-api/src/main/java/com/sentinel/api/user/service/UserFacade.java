package com.sentinel.api.user.service;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.api.user.dto.request.AssignRoleRequest;
import com.sentinel.api.user.dto.request.CreateUserRequest;
import com.sentinel.api.user.dto.request.UpdateUserRequest;
import com.sentinel.api.user.dto.response.CreateUserResponse;
import com.sentinel.api.user.dto.response.UserResponse;

import java.util.UUID;

public interface UserFacade {

    PageResponse<UserResponse> list(UUID tenantId, ListQueryRequest query);

    UserResponse getById(UUID tenantId, UUID id);

    CreateUserResponse create(UUID tenantId, CreateUserRequest request);

    UserResponse update(UUID tenantId, UUID id, UpdateUserRequest request);

    UserResponse assignRole(UUID tenantId, UUID id, AssignRoleRequest request);

    void markInactive(UUID tenantId, UUID id, UUID actorId);
}
