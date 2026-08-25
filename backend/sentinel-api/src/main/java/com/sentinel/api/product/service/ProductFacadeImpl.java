package com.sentinel.api.product.service;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ConflictException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.api.product.dto.request.CreateProductRequest;
import com.sentinel.api.product.dto.request.UpdateProductRequest;
import com.sentinel.api.product.dto.response.ProductResponse;
import com.sentinel.common.postgresql.product.Product;
import com.sentinel.common.postgresql.product.ProductStatus;
import com.sentinel.api.product.mapper.ProductMapper;
import com.sentinel.api.product.repository.ProductSpecifications;
import com.sentinel.api.product.service.core.ProductService;
import com.sentinel.common.postgresql.tenant.Tenant;
import com.sentinel.api.tenant.repository.TenantRepository;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductFacadeImpl implements ProductFacade {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");

    private final ProductService productService;
    private final ProductMapper productMapper;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> list(UUID tenantId, ListQueryRequest query) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Pageable effective =
            query.toPageable(ProductSpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Specification<Product> spec = ProductSpecifications.withFilters(effectiveTenantId, query);
        Page<Product> page = productService.findAll(spec, effective);
        return PageResponse.from(page.map(productMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(UUID tenantId, UUID id) {
        return productMapper.toResponse(requireProductWithAudit(requireTenantId(tenantId), id));
    }

    @Override
    public ProductResponse create(UUID tenantId, CreateProductRequest request, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        String name = request.name().trim();
        if (productService.existsByTenantIdAndNameIgnoreCase(effectiveTenantId, name)) {
            throw new ConflictException("Product name already exists in this tenant");
        }
        Tenant tenantRef = tenantRepository.getReferenceById(effectiveTenantId);
        User actorRef = userRepository.getReferenceById(actorId);
        Product saved = productService.save(productMapper.toEntity(
            new CreateProductRequest(name), tenantRef, actorRef));
        return productMapper.toResponse(requireProductWithAudit(effectiveTenantId, saved.getId()));
    }

    @Override
    public ProductResponse update(
        UUID tenantId, UUID id, UpdateProductRequest request, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Product product = requireProduct(effectiveTenantId, id);
        String name = request.name().trim();
        if (productService.existsByTenantIdAndNameIgnoreCaseAndIdNot(
            effectiveTenantId, name, id)) {
            throw new ConflictException("Product name already exists in this tenant");
        }
        product.setName(name);
        product.setUpdatedBy(userRepository.getReferenceById(actorId));
        productService.save(product);
        return productMapper.toResponse(requireProductWithAudit(effectiveTenantId, id));
    }

    @Override
    public void softDelete(UUID tenantId, UUID id, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Product product = requireProduct(effectiveTenantId, id);
        if (product.getStatus() == ProductStatus.INACTIVE) {
            return;
        }
        product.setStatus(ProductStatus.INACTIVE);
        product.setUpdatedBy(userRepository.getReferenceById(actorId));
        productService.save(product);
    }

    private UUID requireTenantId(UUID tenantId) {
        if (tenantId == null) {
            throw new BadRequestException("Active tenant is required");
        }
        return tenantId;
    }

    private Product requireProduct(UUID tenantId, UUID id) {
        Product product = productService
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (!product.getTenant().getId().equals(tenantId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        return product;
    }

    private Product requireProductWithAudit(UUID tenantId, UUID id) {
        return productService
            .findWithAuditByIdAndTenantId(id, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
}
