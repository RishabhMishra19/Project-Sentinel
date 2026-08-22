package com.sentinel.api.endpoint.service.impl;

import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.endpoint.dto.response.EndpointResponse;
import com.sentinel.api.endpoint.service.EndpointService;
import com.sentinel.api.product.entity.ProductStatus;
import com.sentinel.api.product.repository.ProductRepository;
import com.sentinel.api.service.entity.ServiceStatus;
import com.sentinel.api.service.repository.ServiceRepository;
import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import com.sentinel.common.postgresql.endpoint.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EndpointServiceImpl implements EndpointService {

    private final EndpointRepository endpointRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;

    @Override
    public Long findCountByTenantId(UUID tenantId) {
        List<UUID> productIds = productRepository.findIdsByTenantIdAndStatus(tenantId, ProductStatus.ACTIVE);
        List<UUID> serviceIds = serviceRepository.findIdsByProductIdsAndStatus(productIds, ServiceStatus.ACTIVE);
        return endpointRepository.countByServiceIdIn(serviceIds);
    }

    @Override
    public Long findCountByProductId(UUID productId) {
        List<UUID> serviceIds = serviceRepository.findIdsByProductIdAndStatus(productId, ServiceStatus.ACTIVE);
        return endpointRepository.countByServiceIdIn(serviceIds);
    }

    @Override
    public Long findCountByServiceId(UUID serviceId) {
        return endpointRepository.countByServiceIdIn(List.of(serviceId));
    }

    @Override
    public EndpointResponse findById(UUID id) {
        Endpoint endpoint = endpointRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Endpoint not found with id " + id));
        return new EndpointResponse(endpoint);
    }

    @Override
    public List<EndpointResponse> findByServiceId(UUID serviceId) {
        List<Endpoint> endpoints = endpointRepository.findByServiceId(serviceId);
        return endpoints.stream().map(EndpointResponse::new).toList();
    }

}
