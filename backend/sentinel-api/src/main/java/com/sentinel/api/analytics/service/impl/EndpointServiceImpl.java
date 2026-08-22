package com.sentinel.api.analytics.service.impl;

import com.sentinel.common.analytics.utils.AnalyticsScope;
import com.sentinel.api.analytics.service.EndpointService;
import com.sentinel.api.product.entity.ProductStatus;
import com.sentinel.api.product.repository.ProductRepository;
import com.sentinel.api.service.entity.ServiceStatus;
import com.sentinel.api.service.repository.ServiceRepository;
import com.sentinel.common.observability.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EndpointServiceImpl implements EndpointService {

    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final EndpointRepository endpointRepository;

    @Override
    public long countEndPoints(UUID entityId, AnalyticsScope scope) {
        List<UUID> serviceIds = null;
        switch (scope) {
            case TENANT:
                List<UUID> productIds = productRepository.findAllProductIdsByTenantIdAndStatus(
                        entityId,
                        ProductStatus.ACTIVE
                );
                serviceIds = serviceRepository.findAllServiceIdsByProductIdsAndStatus(productIds, ServiceStatus.ACTIVE);
                break;
            case PRODUCT:
                serviceIds = serviceRepository.findAllServiceIdsByProductIdAndStatus(entityId, ServiceStatus.ACTIVE);
                break;
            case SERVICE:
                serviceIds = List.of(entityId);
                break;
            case ENDPOINT:
                return 1L;
        }
        return endpointRepository.countById_ServiceIdIn(serviceIds);
    }

}
