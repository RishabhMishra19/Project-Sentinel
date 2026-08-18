package com.sentinel.api.tenant.service;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.tenant.dto.request.CreateTenantRequest;
import com.sentinel.server.tenant.dto.request.UpdateTenantRequest;
import com.sentinel.server.tenant.dto.response.CreateTenantResponse;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import java.util.UUID;

public interface TenantFacade {

    PageResponse<TenantResponse> list(ListQueryRequest query);

    TenantResponse getById(UUID id);

    CreateTenantResponse create(CreateTenantRequest request, UUID actorId);

    TenantResponse update(UUID id, UpdateTenantRequest request, UUID actorId);

    void softDelete(UUID id, UUID actorId);
}
