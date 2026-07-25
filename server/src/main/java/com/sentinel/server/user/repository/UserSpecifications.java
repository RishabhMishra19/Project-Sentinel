package com.sentinel.server.user.repository;

import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.entity.UserStatus;
import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class UserSpecifications {

    private UserSpecifications() {}

    public static Specification<User> withFilters(
            UUID tenantId,
            UserStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("tenant").get("id"), tenantId));
            predicates.add(cb.equal(root.get("sentinelAdmin"), false));

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
            return "email";
        }
        return switch (searchBy.trim().toLowerCase()) {
            case "displayname", "display_name", "name" -> "displayName";
            case "email" -> "email";
            default -> "email";
        };
    }
}
