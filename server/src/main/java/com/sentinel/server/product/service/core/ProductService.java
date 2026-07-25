package com.sentinel.server.product.service.core;

import com.sentinel.server.product.entity.Product;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface ProductService {

    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

    Optional<Product> findWithAuditById(UUID id);

    Optional<Product> findWithAuditByIdAndTenantId(UUID id, UUID tenantId);

    Optional<Product> findById(UUID id);

    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id);

    Product save(Product product);
}
