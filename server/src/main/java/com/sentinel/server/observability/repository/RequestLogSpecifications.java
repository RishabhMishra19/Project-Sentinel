package com.sentinel.server.observability.repository;

import com.sentinel.server.observability.entity.RequestLog;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class RequestLogSpecifications {

    private RequestLogSpecifications() {}

    public static Specification<RequestLog> forTenantFilters(
            UUID tenantId,
            Instant from,
            Instant to,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Integer statusCode,
            String statusClass,
            Integer minDurationMs,
            String traceId,
            String requestId) {
        return (root, query, cb) -> {
            boolean isCountQuery =
                    query != null
                            && query.getResultType() != null
                            && (Long.class.equals(query.getResultType()) || long.class.equals(query.getResultType()));
            if (query != null && !isCountQuery) {
                query.distinct(true);
                root.fetch("endpoint", JoinType.INNER)
                        .fetch("service", JoinType.INNER)
                        .fetch("product", JoinType.INNER);
                root.fetch("serviceInstance", JoinType.INNER);
            }

            Join<?, ?> endpoint = root.join("endpoint", JoinType.INNER);
            Join<?, ?> service = endpoint.join("service", JoinType.INNER);
            Join<?, ?> product = service.join("product", JoinType.INNER);

            List<Predicate> preds = new ArrayList<>();
            preds.add(cb.equal(product.get("tenant").get("id"), tenantId));
            preds.add(cb.greaterThanOrEqualTo(root.get("occurredAt"), from));
            preds.add(cb.lessThan(root.get("occurredAt"), to));

            if (productId != null) {
                preds.add(cb.equal(product.get("id"), productId));
            }
            if (serviceId != null) {
                preds.add(cb.equal(service.get("id"), serviceId));
            }
            if (endpointId != null) {
                preds.add(cb.equal(endpoint.get("id"), endpointId));
            }
            if (statusCode != null) {
                preds.add(cb.equal(root.get("statusCode"), statusCode));
            }
            if (statusClass != null && !statusClass.isBlank()) {
                List<Predicate> classPreds = new ArrayList<>();
                for (String token : statusClass.split(",")) {
                    if (token == null || token.isBlank()) {
                        continue;
                    }
                    switch (token.trim().toLowerCase()) {
                        case "2xx" -> classPreds.add(cb.between(root.get("statusCode"), 200, 299));
                        case "3xx" -> classPreds.add(cb.between(root.get("statusCode"), 300, 399));
                        case "4xx" -> classPreds.add(cb.between(root.get("statusCode"), 400, 499));
                        case "5xx" -> classPreds.add(cb.between(root.get("statusCode"), 500, 599));
                        default -> {}
                    }
                }
                if (!classPreds.isEmpty()) {
                    preds.add(cb.or(classPreds.toArray(Predicate[]::new)));
                }
            }
            if (minDurationMs != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("durationMs"), minDurationMs));
            }
            if (traceId != null && !traceId.isBlank()) {
                preds.add(cb.equal(root.get("traceId"), traceId.trim()));
            }
            if (requestId != null && !requestId.isBlank()) {
                preds.add(cb.equal(root.get("requestId"), requestId.trim()));
            }
            return cb.and(preds.toArray(Predicate[]::new));
        };
    }
}
