package com.sentinel.api.logs.service;

import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.logs.dto.request.GetRequestLogsListRequest;
import com.sentinel.api.logs.dto.response.RequestLogListResponse;
import com.sentinel.api.logs.mapper.RequestLogMapper;
import com.sentinel.api.logs.service.core.RequestLogService;
import com.sentinel.api.product.entity.Product;
import com.sentinel.api.service.entity.Service;
import com.sentinel.api.service.service.core.ServiceService;
import com.sentinel.common.cassandra.dto.CursorPaginationResponse;
import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.common.observability.repository.EndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

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

    private final RequestLogService requestLogService;
    private final RequestLogMapper requestLogMapper;
    private final EndpointRepository endpointRepository;
    private final ServiceService serviceService;
    private final RequestLogCassandraPaginator  requestLogCassandraPaginator;

    @Override
    @Transactional(readOnly = true)
    public CursorPaginationResponse<RequestLogListResponse> getAll(GetRequestLogsListRequest request) {
        CursorPaginationResponse<RequestLog> response = requestLogCassandraPaginator.getPage(request);

        Map<UUID, Endpoint> endpoints = loadEndpoints(response.getContent(), request.getServiceId());
        Map<UUID, Service> services = loadServices(endpoints.values());

        List<RequestLogListResponse> apiResult = response
                .getContent()
                .stream()
                .map(v->this.toResponse(v, endpoints, services))
                .toList();

        return response.getApiResponse(apiResult);
    }

    @Override
    @Transactional(readOnly = true)
    public RequestLogListResponse getById(UUID tenantId, UUID serviceId, UUID id) {
        RequestLog log =
                requestLogService
                        .getLogById(tenantId, serviceId, id)
                        .orElseThrow(() -> new ResourceNotFoundException("Request log not found"));
        Map<UUID, Endpoint> endpoints = loadEndpoints(List.of(log), serviceId);
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

    private Map<UUID, Endpoint> loadEndpoints(List<RequestLog> logs, UUID serviceId) {
        Set<UUID> ids = new HashSet<>();
        for (RequestLog log : logs) {
            if (log.getEndpointId() != null) {
                ids.add(log.getEndpointId());
            }
        }
        Map<UUID, Endpoint> endpoints = new HashMap<>();
        if (!ids.isEmpty()) {
            for (Endpoint endpoint : endpointRepository.findByServiceIdAndEndpointIdIn(serviceId, ids.stream().toList())) {
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

}
