package com.sentinel.api.apikey.service;

import com.sentinel.api.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.api.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.api.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import java.util.UUID;

public interface ServiceApiKeyFacade {

    PageResponse<ServiceApiKeyResponse> list(
            UUID tenantId, UUID productId, UUID serviceId, ListQueryRequest query);

    ServiceApiKeyResponse getById(UUID tenantId, UUID productId, UUID serviceId, UUID id);

    ServiceApiKeyCreatedResponse create(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            CreateServiceApiKeyRequest request,
            UUID actorId);

    void revoke(UUID tenantId, UUID productId, UUID serviceId, UUID id, UUID actorId);
}
