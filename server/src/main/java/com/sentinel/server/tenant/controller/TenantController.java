package com.sentinel.server.tenant.controller;

import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import com.sentinel.server.tenant.dto.request.CreateTenantRequest;
import com.sentinel.server.tenant.dto.request.UpdateTenantRequest;
import com.sentinel.server.tenant.dto.response.CreateTenantResponse;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import com.sentinel.server.tenant.entity.TenantStatus;
import com.sentinel.server.tenant.service.TenantFacade;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantFacade tenantFacade;

    @PreAuthorize("@accessSupport.isSentinelAdmin()")
    @GetMapping
    public ResponseEntity<PageResponse<TenantResponse>> list(
            Pageable pageable,
            @RequestParam(required = false) TenantStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String searchBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate createdFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate createdTo) {
        return ApiResponses.okPage(
                tenantFacade.list(pageable, status, q, searchBy, createdFrom, createdTo));
    }

    @PreAuthorize("@accessSupport.canReadTenant()")
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

    @PreAuthorize("@accessSupport.canWriteTenant()")
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
