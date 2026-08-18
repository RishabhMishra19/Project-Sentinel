package com.sentinel.api.service.service.core;

import com.sentinel.api.service.entity.Service;
import com.sentinel.api.service.repository.ServiceRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Service> findAll(Specification<Service> spec, Pageable pageable) {
        return serviceRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Service> findWithAuditById(UUID id) {
        return serviceRepository.findWithAuditById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Service> findWithAuditByIdAndProductId(UUID id, UUID productId) {
        return serviceRepository.findWithAuditByIdAndProductId(id, productId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Service> findById(UUID id) {
        return serviceRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByProductIdAndNameIgnoreCase(UUID productId, String name) {
        return serviceRepository.existsByProductIdAndNameIgnoreCase(productId, name);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByProductIdAndNameIgnoreCaseAndIdNot(
            UUID productId, String name, UUID id) {
        return serviceRepository.existsByProductIdAndNameIgnoreCaseAndIdNot(productId, name, id);
    }

    @Override
    public Service save(Service service) {
        return serviceRepository.save(service);
    }
}
