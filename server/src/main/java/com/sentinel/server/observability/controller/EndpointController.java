package com.sentinel.server.observability.controller;

import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.observability.dto.response.EndpointResponse;
import com.sentinel.server.observability.repository.EndpointRepository;
import com.sentinel.server.security.UserPrincipal;
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

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping
    public ResponseEntity<List<EndpointResponse>> listByService(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID serviceId) {
        List<EndpointResponse> endpoints =
                endpointRepository
                        .findByServiceIdAndServiceProductTenantIdOrderByMethodAscPathTemplateAsc(
                                serviceId, principal.getActiveTenantId())
                        .stream()
                        .map(
                                e -> new EndpointResponse(
                                        e.getId().toString(),
                                        e.getService().getId().toString(),
                                        e.getMethod(),
                                        e.getPathTemplate()))
                        .toList();
        return ApiResponses.ok(endpoints);
    }
}
