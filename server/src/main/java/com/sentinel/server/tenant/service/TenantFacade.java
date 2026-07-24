package com.sentinel.server.tenant.service;

import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.tenant.dto.CreateTenantRequest;
import com.sentinel.server.tenant.dto.TenantResponse;
import com.sentinel.server.tenant.dto.UpdateTenantRequest;
import com.sentinel.server.tenant.entity.TenantStatus;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface TenantFacade {

    PageResponse<TenantResponse> list(Pageable pageable, TenantStatus status);

    TenantResponse getById(UUID id);

    TenantResponse create(CreateTenantRequest request, UUID actorId);

    TenantResponse update(UUID id, UpdateTenantRequest request, UUID actorId);

    void softDelete(UUID id, UUID actorId);
}
