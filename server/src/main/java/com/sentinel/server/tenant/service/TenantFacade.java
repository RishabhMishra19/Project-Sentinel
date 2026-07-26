package com.sentinel.server.tenant.service;

import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.tenant.dto.request.CreateTenantRequest;
import com.sentinel.server.tenant.dto.request.UpdateTenantRequest;
import com.sentinel.server.tenant.dto.response.CreateTenantResponse;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import com.sentinel.server.tenant.entity.TenantStatus;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface TenantFacade {

    PageResponse<TenantResponse> list(
            Pageable pageable,
            TenantStatus status,
            String q,
            String searchBy,
            LocalDate from,
            LocalDate to);

    TenantResponse getById(UUID id);

    CreateTenantResponse create(CreateTenantRequest request, UUID actorId);

    TenantResponse update(UUID id, UpdateTenantRequest request, UUID actorId);

    void softDelete(UUID id, UUID actorId);
}
