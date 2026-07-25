package com.sentinel.server.user.service;

import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.user.dto.request.AssignRoleRequest;
import com.sentinel.server.user.dto.request.CreateUserRequest;
import com.sentinel.server.user.dto.request.UpdateUserRequest;
import com.sentinel.server.user.dto.response.CreateUserResponse;
import com.sentinel.server.user.dto.response.UserResponse;
import com.sentinel.server.user.entity.UserStatus;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface UserFacade {

    PageResponse<UserResponse> list(
            UUID tenantId,
            Pageable pageable,
            UserStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo);

    UserResponse getById(UUID tenantId, UUID id);

    CreateUserResponse create(UUID tenantId, CreateUserRequest request);

    UserResponse update(UUID tenantId, UUID id, UpdateUserRequest request);

    UserResponse assignRole(UUID tenantId, UUID id, AssignRoleRequest request);

    void markInactive(UUID tenantId, UUID id, UUID actorId);
}
