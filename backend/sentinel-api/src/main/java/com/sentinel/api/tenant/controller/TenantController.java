package com.sentinel.api.tenant.controller;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import com.sentinel.server.tenant.dto.request.CreateTenantRequest;
import com.sentinel.server.tenant.dto.request.UpdateTenantRequest;
import com.sentinel.server.tenant.dto.response.CreateTenantResponse;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import com.sentinel.server.tenant.service.TenantFacade;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantFacade tenantFacade;

    @PreAuthorize("@accessSupport.isSentinelAdmin()")
    @PostMapping("/search")
    public ResponseEntity<PageResponse<TenantResponse>> search(@RequestBody ListQueryRequest query) {
        return ApiResponses.okPage(tenantFacade.list(query));
    }

    @PreAuthorize("@accessSupport.canReadTenant(#id)")
    @GetMapping("/{id}")
    public ResponseEntity<TenantResponse> getById(@PathVariable UUID id) {
        return ApiResponses.ok(tenantFacade.getById(id));
    }

    @PreAuthorize("@accessSupport.isSentinelAdmin()")
    @PostMapping
    public ResponseEntity<CreateTenantResponse> create(
            @Valid @RequestBody CreateTenantRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(tenantFacade.create(request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteTenant(#id)")
    @PutMapping("/{id}")
    public ResponseEntity<TenantResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTenantRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(tenantFacade.update(id, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.isSentinelAdmin()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(
            @PathVariable UUID id, @AuthenticationPrincipal UserPrincipal principal) {
        tenantFacade.softDelete(id, principal.getId());
        return ApiResponses.noContent();
    }
}
