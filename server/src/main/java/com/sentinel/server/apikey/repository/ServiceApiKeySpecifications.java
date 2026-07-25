package com.sentinel.server.apikey.repository;

import com.sentinel.server.apikey.entity.ServiceApiKey;
import com.sentinel.server.apikey.entity.ServiceApiKeyStatus;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class ServiceApiKeySpecifications {

    private ServiceApiKeySpecifications() {}

    public static Specification<ServiceApiKey> forService(
            UUID serviceId, ServiceApiKeyStatus status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("service").get("id"), serviceId));
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
