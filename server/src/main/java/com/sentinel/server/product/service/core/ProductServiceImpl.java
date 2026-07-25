package com.sentinel.server.product.service.core;

import com.sentinel.server.product.entity.Product;
import com.sentinel.server.product.repository.ProductRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Product> findAll(Specification<Product> spec, Pageable pageable) {
        return productRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findWithAuditById(UUID id) {
        return productRepository.findWithAuditById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findWithAuditByIdAndTenantId(UUID id, UUID tenantId) {
        return productRepository.findWithAuditByIdAndTenantId(id, tenantId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Product> findById(UUID id) {
        return productRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name) {
        return productRepository.existsByTenantIdAndNameIgnoreCase(tenantId, name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID id) {
        return productRepository.existsByTenantIdAndNameIgnoreCaseAndIdNot(tenantId, name, id);
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }
}
