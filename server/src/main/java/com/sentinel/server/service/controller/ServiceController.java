package com.sentinel.server.service.controller;

import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import com.sentinel.server.service.dto.request.CreateServiceRequest;
import com.sentinel.server.service.dto.response.ServiceResponse;
import com.sentinel.server.service.dto.request.UpdateServiceRequest;
import com.sentinel.server.service.entity.ServiceStatus;
import com.sentinel.server.service.service.ServiceFacade;
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
@RequestMapping("/api/products/{productId}/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceFacade serviceFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping
    public ResponseEntity<PageResponse<ServiceResponse>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId,
            Pageable pageable,
            @RequestParam(required = false) ServiceStatus status,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String searchBy,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
                    LocalDate to) {
        return ApiResponses.okPage(serviceFacade.list(
                principal.getActiveTenantId(),
                productId,
                pageable,
                status,
                q,
                searchBy,
                from,
                to));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId,
            @PathVariable UUID id) {
        return ApiResponses.ok(
                serviceFacade.getById(principal.getActiveTenantId(), productId, id));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @PostMapping
    public ResponseEntity<ServiceResponse> create(
            @PathVariable UUID productId,
            @Valid @RequestBody CreateServiceRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(serviceFacade.create(
                principal.getActiveTenantId(), productId, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> update(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateServiceRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(serviceFacade.update(
                principal.getActiveTenantId(), productId, id, request, principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(
            @PathVariable UUID productId,
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        serviceFacade.softDelete(
                principal.getActiveTenantId(), productId, id, principal.getId());
        return ApiResponses.noContent();
    }
}
