package com.sentinel.api.observability.controller;

import com.sentinel.common.observability.repository.EndpointRepository;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.response.ApiResponses;
import com.sentinel.api.observability.dto.response.EndpointResponse;
import com.sentinel.api.security.UserPrincipal;
import com.sentinel.api.service.service.core.ServiceService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services/{serviceId}/endpoints")
@RequiredArgsConstructor
public class EndpointController {

    private final EndpointRepository endpointRepository;
    private final ServiceService serviceService;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping
    public ResponseEntity<List<EndpointResponse>> listByService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID serviceId) {
        requireServiceInTenant(serviceId, principal.getActiveTenantId());
        List<EndpointResponse> endpoints =
                endpointRepository
                        .findByServiceIdOrderByMethodAscPathTemplateAsc(serviceId)
                        .stream()
                        .map(
                                e -> new EndpointResponse(
                                        e.getId().toString(),
                                        e.getServiceId().toString(),
                                        e.getMethod(),
                                        e.getPathTemplate()))
                        .toList();
        return ApiResponses.ok(endpoints);
    }

    private void requireServiceInTenant(UUID serviceId, UUID tenantId) {
        serviceService
                .findWithAuditById(serviceId)
                .filter(s -> s.getProduct().getTenant().getId().equals(tenantId))
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }
}
