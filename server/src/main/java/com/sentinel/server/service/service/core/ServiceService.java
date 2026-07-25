package com.sentinel.server.service.service.core;

import com.sentinel.server.service.entity.Service;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface ServiceService {

    Page<Service> findAll(Specification<Service> spec, Pageable pageable);

    Optional<Service> findWithAuditById(UUID id);

    Optional<Service> findWithAuditByIdAndProductId(UUID id, UUID productId);

    Optional<Service> findById(UUID id);

    boolean existsByProductIdAndNameIgnoreCase(UUID productId, String name);

    boolean existsByProductIdAndNameIgnoreCaseAndIdNot(UUID productId, String name, UUID id);

    Service save(Service service);
}
