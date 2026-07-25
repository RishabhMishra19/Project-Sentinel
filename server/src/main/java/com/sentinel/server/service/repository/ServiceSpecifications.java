package com.sentinel.server.service.repository;

import com.sentinel.server.service.entity.Service;
import com.sentinel.server.service.entity.ServiceStatus;
import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ServiceSpecifications {

    private ServiceSpecifications() {}

    public static Specification<Service> withFilters(
            UUID productId,
            ServiceStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo) {
        return withFilters(null, productId, status, q, searchBy, createdFrom, createdTo);
    }

    public static Specification<Service> forTenant(
            UUID tenantId,
            ServiceStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo) {
        return withFilters(tenantId, null, status, q, searchBy, createdFrom, createdTo);
    }

    private static Specification<Service> withFilters(
            UUID tenantId,
            UUID productId,
            ServiceStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (tenantId != null) {
                predicates.add(cb.equal(root.get("product").get("tenant").get("id"), tenantId));
            }
            if (productId != null) {
                predicates.add(cb.equal(root.get("product").get("id"), productId));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (StringUtils.hasText(q)) {
                String pattern = "%" + q.trim().toLowerCase() + "%";
                String field = resolveSearchField(searchBy);
                predicates.add(cb.like(cb.lower(root.get(field)), pattern));
            }

            if (createdFrom != null) {
                Instant from = createdFrom.atStartOfDay(ZoneOffset.UTC).toInstant();
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }

            if (createdTo != null) {
                Instant to = createdTo.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
                predicates.add(cb.lessThan(root.get("createdAt"), to));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static String resolveSearchField(String searchBy) {
        if (!StringUtils.hasText(searchBy)) {
            return "name";
        }
        return switch (searchBy.trim().toLowerCase()) {
            case "name" -> "name";
            default -> "name";
        };
    }
}
