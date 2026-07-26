package com.sentinel.server.product.service;

import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.product.dto.request.CreateProductRequest;
import com.sentinel.server.product.dto.response.ProductResponse;
import com.sentinel.server.product.dto.request.UpdateProductRequest;
import com.sentinel.server.product.entity.ProductStatus;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface ProductFacade {

    PageResponse<ProductResponse> list(
            UUID tenantId,
            Pageable pageable,
            ProductStatus status,
            String q,
            String searchBy,
            LocalDate from,
            LocalDate to);

    ProductResponse getById(UUID tenantId, UUID id);

    ProductResponse create(UUID tenantId, CreateProductRequest request, UUID actorId);

    ProductResponse update(UUID tenantId, UUID id, UpdateProductRequest request, UUID actorId);

    void softDelete(UUID tenantId, UUID id, UUID actorId);
}
