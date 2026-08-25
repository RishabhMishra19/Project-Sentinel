package com.sentinel.api.product.service.core;

import com.sentinel.common.postgresql.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;
import java.util.UUID;

public interface ProductService {

    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    Optional<Product> findWithAuditById(UUID id);

    Optional<Product> findWithAuditByIdAndTenantId(UUID id, UUID tenantId);

    Optional<Product> findById(UUID id);

    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id);

    Product save(Product product);
}
