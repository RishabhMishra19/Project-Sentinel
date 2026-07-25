package com.sentinel.server.product.repository;

import com.sentinel.server.product.entity.Product;
import com.sentinel.server.product.entity.ProductStatus;
import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> withFilters(
            UUID tenantId,
            ProductStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("tenant").get("id"), tenantId));

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
