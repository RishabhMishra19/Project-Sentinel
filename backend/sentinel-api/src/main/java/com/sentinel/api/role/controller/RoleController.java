package com.sentinel.api.role.controller;

import com.sentinel.api.common.response.ApiResponses;
import com.sentinel.api.role.dto.request.CreateRoleRequest;
import com.sentinel.api.role.dto.request.CreateRoleScopeRequest;
import com.sentinel.api.role.dto.request.UpdateRoleRequest;
import com.sentinel.api.role.dto.request.UpdateRoleScopeRequest;
import com.sentinel.api.role.dto.response.RoleResponse;
import com.sentinel.api.role.dto.response.RoleScopeResponse;
import com.sentinel.api.role.service.RoleFacade;
import com.sentinel.api.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleFacade roleFacade;

    @PreAuthorize("@accessSupport.canReadUsers()")
    @GetMapping
    public ResponseEntity<List<RoleResponse>> list(
        @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(roleFacade.list(principal.getActiveTenantId()));
    }

    @PreAuthorize("@accessSupport.canReadUsers()")
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getById(
        @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(roleFacade.getById(principal.getActiveTenantId(), id));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping
    public ResponseEntity<RoleResponse> create(
        @Valid @RequestBody CreateRoleRequest request,
        @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(
            roleFacade.create(principal.getActiveTenantId(), request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> update(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateRoleRequest request,
        @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(roleFacade.update(
            principal.getActiveTenantId(), id, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping("/{id}/mark-inactive")
    public ResponseEntity<Void> markInactive(
        @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        roleFacade.markInactive(principal.getActiveTenantId(), id, principal.getId());
        return ApiResponses.noContent();
    }

    @PreAuthorize("@accessSupport.canReadUsers()")
    @GetMapping("/{id}/scopes")
    public ResponseEntity<List<RoleScopeResponse>> listScopes(
        @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(roleFacade.listScopes(principal.getActiveTenantId(), id));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping("/{id}/scopes")
    public ResponseEntity<RoleScopeResponse> createScope(
        @PathVariable UUID id,
        @Valid @RequestBody CreateRoleScopeRequest request,
        @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(roleFacade.createScope(
            principal.getActiveTenantId(), id, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PutMapping("/{id}/scopes/{scopeId}")
    public ResponseEntity<RoleScopeResponse> updateScope(
        @PathVariable UUID id,
        @PathVariable UUID scopeId,
        @Valid @RequestBody UpdateRoleScopeRequest request,
        @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(roleFacade.updateScope(
            principal.getActiveTenantId(), id, scopeId, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteUsers()")
    @PostMapping("/{id}/scopes/{scopeId}/deactivate")
    public ResponseEntity<Void> deactivateScope(
        @PathVariable UUID id,
        @PathVariable UUID scopeId,
        @AuthenticationPrincipal UserPrincipal principal) {
        roleFacade.deactivateScope(
            principal.getActiveTenantId(), id, scopeId, principal.getId());
        return ApiResponses.noContent();
    }
}
