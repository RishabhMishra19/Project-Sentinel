package com.sentinel.server.user.controller;

import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import com.sentinel.server.user.dto.request.AssignRoleRequest;
import com.sentinel.server.user.dto.request.CreateUserRequest;
import com.sentinel.server.user.dto.request.UpdateUserRequest;
import com.sentinel.server.user.dto.response.CreateUserResponse;
import com.sentinel.server.user.dto.response.UserResponse;
import com.sentinel.server.user.entity.UserStatus;
import com.sentinel.server.user.service.UserFacade;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserFacade userFacade;

    @PreAuthorize("@accessSupport.canReadUsers()")
    @GetMapping
    public ResponseEntity<PageResponse<UserResponse>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            Pageable pageable,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String searchBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate createdTo) {
        return ApiResponses.okPage(userFacade.list(
                principal.getActiveTenantId(),
                pageable,
                status,
                q,
                searchBy,
                createdFrom,
                createdTo));
    }

    @PreAuthorize("@accessSupport.canReadUsers()")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal, @PathVariable UUID id) {
        return ApiResponses.ok(userFacade.getById(principal.getActiveTenantId(), id));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping
    public ResponseEntity<CreateUserResponse> create(
            @Valid @RequestBody CreateUserRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(userFacade.create(principal.getActiveTenantId(), request));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(userFacade.update(principal.getActiveTenantId(), id, request));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping("/{id}/roles")
    public ResponseEntity<UserResponse> assignRole(
            @PathVariable UUID id,
            @Valid @RequestBody AssignRoleRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(userFacade.assignRole(principal.getActiveTenantId(), id, request));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping("/{id}/mark-inactive")
    public ResponseEntity<Void> markInactive(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        userFacade.markInactive(principal.getActiveTenantId(), id, principal.getId());
        return ApiResponses.noContent();
    }
}
