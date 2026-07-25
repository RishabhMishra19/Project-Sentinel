package com.sentinel.server.service.service;

import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.service.dto.request.CreateServiceRequest;
import com.sentinel.server.service.dto.response.ServiceResponse;
import com.sentinel.server.service.dto.request.UpdateServiceRequest;
import com.sentinel.server.service.entity.ServiceStatus;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface ServiceFacade {

    PageResponse<ServiceResponse> list(
            UUID tenantId,
            UUID productId,
            Pageable pageable,
            ServiceStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo);

    PageResponse<ServiceResponse> listAll(
            UUID tenantId,
            Pageable pageable,
            ServiceStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo);

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
