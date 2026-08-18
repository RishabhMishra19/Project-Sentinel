package com.sentinel.api.apikey.controller;

import com.sentinel.server.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.server.apikey.service.ServiceApiKeyFacade;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.UserPrincipal;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/{productId}/services/{serviceId}/api-keys")
@RequiredArgsConstructor
public class ServiceApiKeyController {

    private final ServiceApiKeyFacade serviceApiKeyFacade;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @PostMapping("/search")
    public ResponseEntity<PageResponse<ServiceApiKeyResponse>> search(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId,
            @PathVariable UUID serviceId,
            @RequestBody ListQueryRequest query) {
        return ApiResponses.okPage(serviceApiKeyFacade.list(
                principal.getActiveTenantId(), productId, serviceId, query));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceApiKeyResponse> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID productId,
            @PathVariable UUID serviceId,
            @PathVariable UUID id) {
        return ApiResponses.ok(serviceApiKeyFacade.getById(
                principal.getActiveTenantId(), productId, serviceId, id));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @PostMapping
    public ResponseEntity<ServiceApiKeyCreatedResponse> create(
            @PathVariable UUID productId,
            @PathVariable UUID serviceId,
            @Valid @RequestBody CreateServiceApiKeyRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.created(serviceApiKeyFacade.create(
                principal.getActiveTenantId(),
                productId,
                serviceId,
                request,
                principal.getId()));
    }

    @PreAuthorize("@accessSupport.canWriteProductsAndServices()")
    @PostMapping("/{id}/revoke")
    public ResponseEntity<Void> revoke(
            @PathVariable UUID productId,
            @PathVariable UUID serviceId,
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        serviceApiKeyFacade.revoke(
                principal.getActiveTenantId(), productId, serviceId, id, principal.getId());
        return ApiResponses.noContent();
    }
}
