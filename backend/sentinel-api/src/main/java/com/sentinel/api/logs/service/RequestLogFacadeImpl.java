package com.sentinel.api.logs.service;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.response.CursorPaginationResponse;
import com.sentinel.api.logs.dto.request.RequestLogListRequest;
import com.sentinel.api.logs.dto.response.RequestLogListResponse;
import com.sentinel.api.logs.mapper.RequestLogMapper;
import com.sentinel.api.logs.service.core.RequestLogService;
import com.sentinel.api.product.entity.Product;
import com.sentinel.api.service.entity.Service;
import com.sentinel.api.service.service.core.ServiceService;
import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.common.observability.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class RequestLogFacadeImpl implements RequestLogFacade {

    private static final Duration MAX_RANGE = Duration.ofDays(7);

    private final RequestLogService requestLogService;
    private final RequestLogMapper requestLogMapper;
    private final EndpointRepository endpointRepository;
    private final ServiceService serviceService;

    @Override
    @Transactional(readOnly = true)
    public CursorPaginationResponse<RequestLogListResponse> getAll(UUID tenantId, RequestLogListRequest request) {
        this.validateRange(request.getFrom(), request.getTo());
        Slice<RequestLog> slice = requestLogService.findAllPaginated(tenantId, request);
        Map<UUID, Endpoint> endpoints = loadEndpoints(slice.getContent());
        Map<UUID, Service> services = loadServices(endpoints.values());
        return CursorPaginationResponse.from(slice.map(key->toResponse(key, endpoints, services)), request);
    }

    @Override
    @Transactional(readOnly = true)
    public RequestLogListResponse getById(UUID tenantId, UUID id) {
        RequestLog log =
                requestLogService
                        .findByIdForTenant(tenantId, id)
                        .orElseThrow(() -> new ResourceNotFoundException("Request log not found"));
        Map<UUID, Endpoint> endpoints = loadEndpoints(List.of(log));
        Map<UUID, Service> services = loadServices(endpoints.values());
        return toResponse(log, endpoints, services);
    }

    private RequestLogListResponse toResponse(
            RequestLog log, Map<UUID, Endpoint> endpoints, Map<UUID, Service> services) {
        Endpoint endpoint = endpoints.get(log.getEndpointId());
        if (endpoint == null) {
            throw new ResourceNotFoundException("Endpoint not found");
        }
        Service service = services.get(endpoint.getId().getServiceId());
        if (service == null) {
            throw new ResourceNotFoundException("Service not found");
        }
        Product product = service.getProduct();
        return requestLogMapper.toResponse(log, endpoint, service, product);
    }

    private Map<UUID, Endpoint> loadEndpoints(List<RequestLog> logs) {
        Set<Endpoint.PrimaryKeyComposite> ids = new HashSet<>();
        for (RequestLog log : logs) {
            if (log.getEndpointId() != null) {
                ids.add(new Endpoint.PrimaryKeyComposite(log.getId().getServiceId(), log.getEndpointId()));
            }
        }
        Map<UUID, Endpoint> endpoints = new HashMap<>();
        if (!ids.isEmpty()) {
            for (Endpoint endpoint : endpointRepository.findAllById(ids)) {
                endpoints.put(endpoint.getId().getEndpointId(), endpoint);
            }
        }
        return endpoints;
    }

    private Map<UUID, Service> loadServices(Iterable<Endpoint> endpoints) {
        Set<UUID> ids = new HashSet<>();
        for (Endpoint endpoint : endpoints) {
            if (endpoint.getId().getServiceId() != null) {
                ids.add(endpoint.getId().getServiceId());
            }
        }
        Map<UUID, Service> services = new HashMap<>();
        for (UUID id : ids) {
            serviceService
                    .findWithAuditById(id)
                    .ifPresent(service -> services.put(service.getId(), service));
        }
        return services;
    }

    private void validateRange(Instant from, Instant to) {
        if (!from.isBefore(to)) {
            throw new BadRequestException("from must be before to");
        }
        if (Duration.between(from, to).compareTo(MAX_RANGE) > 0) {
            throw new BadRequestException("Logs time range cannot exceed 7 days");
        }
    }
}
