package com.sentinel.server.apikey.service;

import com.sentinel.server.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.server.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.server.common.response.PageResponse;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface ServiceApiKeyFacade {

    PageResponse<ServiceApiKeyResponse> list(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            Pageable pageable,
            ServiceApiKeyStatus status);

    ServiceApiKeyResponse getById(UUID tenantId, UUID productId, UUID serviceId, UUID id);

    ServiceApiKeyCreatedResponse create(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            CreateServiceApiKeyRequest request,
            UUID actorId);

    void revoke(UUID tenantId, UUID productId, UUID serviceId, UUID id, UUID actorId);
}
