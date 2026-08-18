package com.sentinel.api.service.service;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.service.dto.request.CreateServiceRequest;
import com.sentinel.server.service.dto.response.ServiceResponse;
import com.sentinel.server.service.dto.request.UpdateServiceRequest;
import java.util.UUID;

public interface ServiceFacade {

    PageResponse<ServiceResponse> list(UUID tenantId, UUID productId, ListQueryRequest query);

    PageResponse<ServiceResponse> listAll(UUID tenantId, ListQueryRequest query);

    ServiceResponse getById(UUID tenantId, UUID productId, UUID id);

    ServiceResponse create(
            UUID tenantId, UUID productId, CreateServiceRequest request, UUID actorId);

    ServiceResponse update(
            UUID tenantId,
            UUID productId,
            UUID id,
            UpdateServiceRequest request,
            UUID actorId);

    void softDelete(UUID tenantId, UUID productId, UUID id, UUID actorId);
}
