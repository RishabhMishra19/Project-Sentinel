package com.sentinel.server.product.service;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.product.dto.request.CreateProductRequest;
import com.sentinel.server.product.dto.response.ProductResponse;
import com.sentinel.server.product.dto.request.UpdateProductRequest;
import java.util.UUID;

public interface ProductFacade {

    PageResponse<ProductResponse> list(UUID tenantId, ListQueryRequest query);

    ProductResponse getById(UUID tenantId, UUID id);

    ProductResponse create(UUID tenantId, CreateProductRequest request, UUID actorId);

    ProductResponse update(UUID tenantId, UUID id, UpdateProductRequest request, UUID actorId);

    void softDelete(UUID tenantId, UUID id, UUID actorId);
}
