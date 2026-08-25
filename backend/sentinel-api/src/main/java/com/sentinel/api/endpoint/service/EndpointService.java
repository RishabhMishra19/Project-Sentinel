package com.sentinel.api.endpoint.service;

import com.sentinel.api.endpoint.dto.response.EndpointResponse;

import java.util.List;
import java.util.UUID;

public interface EndpointService {

    Long findCountByTenantId(UUID tenantId);

    Long findCountByProductId(UUID productId);

    Long findCountByServiceId(UUID serviceId);

    EndpointResponse findById(UUID id);

    List<EndpointResponse> findByServiceId(UUID serviceId);

}
