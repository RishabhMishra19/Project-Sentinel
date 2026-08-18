package com.sentinel.api.logs.service;

import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.common.observability.repository.EndpointRepository;
import com.sentinel.server.common.exception.BadRequestException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.logs.dto.response.RequestLogResponse;
import com.sentinel.server.logs.mapper.RequestLogMapper;
import com.sentinel.server.logs.service.core.RequestLogService;
import com.sentinel.server.observability.repository.RequestLogSpecifications;
import com.sentinel.server.product.entity.Product;
import com.sentinel.server.service.entity.Service;
import com.sentinel.server.service.service.core.ServiceService;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class RequestLogFacadeImpl implements RequestLogFacade {

    private static final Duration MAX_RANGE = Duration.ofDays(7);
    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "occurredAt");

    private final RequestLogService requestLogService;
    private final RequestLogMapper requestLogMapper;
    private final EndpointRepository endpointRepository;
    private final ServiceService serviceService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<RequestLogResponse> list(UUID tenantId, ListQueryRequest query) {
        ListQueryRequest effectiveQuery = query != null ? query : new ListQueryRequest();
        Instant rangeTo = effectiveQuery.getTo() != null ? effectiveQuery.getTo() : Instant.now();
        Instant rangeFrom =
                effectiveQuery.getFrom() != null
                        ? effectiveQuery.getFrom()
                        : rangeTo.minus(Duration.ofHours(1));
        validateRange(rangeFrom, rangeTo);
        effectiveQuery.setFrom(rangeFrom);
        effectiveQuery.setTo(rangeTo);

        Pageable pageable =
                effectiveQuery.toPageable(RequestLogSpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Page<RequestLog> page = requestLogService.search(tenantId, effectiveQuery, pageable);
        Map<UUID, Endpoint> endpoints = loadEndpoints(page.getContent());
        Map<UUID, Service> services = loadServices(endpoints.values());
        return PageResponse.from(
                page.map(log -> toResponse(log, endpoints, services)));
    }

    @Override
    @Transactional(readOnly = true)
    public RequestLogResponse getById(UUID tenantId, UUID id) {
        RequestLog log =
                requestLogService
                        .findByIdForTenant(tenantId, id)
                        .orElseThrow(() -> new ResourceNotFoundException("Request log not found"));
        Map<UUID, Endpoint> endpoints = loadEndpoints(List.of(log));
        Map<UUID, Service> services = loadServices(endpoints.values());
        return toResponse(log, endpoints, services);
    }

    private RequestLogResponse toResponse(
            RequestLog log, Map<UUID, Endpoint> endpoints, Map<UUID, Service> services) {
        Endpoint endpoint = endpoints.get(log.getEndpointId());
        if (endpoint == null) {
            throw new ResourceNotFoundException("Endpoint not found");
        }
        Service service = services.get(endpoint.getServiceId());
        if (service == null) {
            throw new ResourceNotFoundException("Service not found");
        }
        Product product = service.getProduct();
        return requestLogMapper.toResponse(log, endpoint, service, product);
    }

    private Map<UUID, Endpoint> loadEndpoints(List<RequestLog> logs) {
        Set<UUID> ids = new HashSet<>();
        for (RequestLog log : logs) {
            if (log.getEndpointId() != null) {
                ids.add(log.getEndpointId());
            }
        }
        Map<UUID, Endpoint> endpoints = new HashMap<>();
        if (!ids.isEmpty()) {
            for (Endpoint endpoint : endpointRepository.findAllById(ids)) {
                endpoints.put(endpoint.getId(), endpoint);
            }
        }
        return endpoints;
    }

    private Map<UUID, Service> loadServices(Iterable<Endpoint> endpoints) {
        Set<UUID> ids = new HashSet<>();
        for (Endpoint endpoint : endpoints) {
            if (endpoint.getServiceId() != null) {
                ids.add(endpoint.getServiceId());
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
