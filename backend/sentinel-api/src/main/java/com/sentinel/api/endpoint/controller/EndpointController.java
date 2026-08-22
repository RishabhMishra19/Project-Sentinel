package com.sentinel.api.endpoint.controller;

import com.sentinel.api.common.response.ApiResponses;
import com.sentinel.api.endpoint.dto.response.EndpointResponse;
import com.sentinel.api.endpoint.service.EndpointService;
import com.sentinel.api.service.service.core.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/services/{serviceId}/endpoints")
@RequiredArgsConstructor
public class EndpointController {

    private final EndpointService endpointService;
    private final ServiceService serviceService;

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping
    public ResponseEntity<List<EndpointResponse>> listByService(@PathVariable UUID serviceId) {
        return ApiResponses.ok(endpointService.findByServiceId(serviceId));
    }

    @PreAuthorize("@accessSupport.canReadProductsAndServices()")
    @GetMapping("/{endpointId}")
    public ResponseEntity<EndpointResponse> getById(@PathVariable UUID endpointId) {
        return ApiResponses.ok(endpointService.findById(endpointId));
    }

}
