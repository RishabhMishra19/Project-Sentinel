package com.sentinel.api.product.service;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.api.product.dto.request.CreateProductRequest;
import com.sentinel.api.product.dto.response.ProductResponse;
import com.sentinel.api.product.dto.request.UpdateProductRequest;
import java.util.UUID;

public interface ProductFacade {

    PageResponse<ProductResponse> list(UUID tenantId, ListQueryRequest query);

    ProductResponse getById(UUID tenantId, UUID id);

    ProductResponse create(UUID tenantId, CreateProductRequest request, UUID actorId);

    ProductResponse update(UUID tenantId, UUID id, UpdateProductRequest request, UUID actorId);

    void softDelete(UUID tenantId, UUID id, UUID actorId);
}
