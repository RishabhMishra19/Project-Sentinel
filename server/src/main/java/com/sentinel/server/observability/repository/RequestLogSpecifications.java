package com.sentinel.server.observability.repository;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.specification.GenericSpecifications;
import com.sentinel.server.common.specification.QueryFieldAllowlist;
import com.sentinel.server.observability.entity.RequestLog;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class RequestLogSpecifications {

    public static final QueryFieldAllowlist FIELDS =
            QueryFieldAllowlist.builder()
                    .equal("productId", "endpoint.service.product.id", UUID.class)
                    .equal("serviceId", "endpoint.service.id", UUID.class)
                    .equal("endpointId", "endpoint.id", UUID.class)
                    .equal("statusCode", "statusCode", Integer.class)
                    .statusClass("statusClass", "statusCode")
                    .gte("minDurationMs", "durationMs", Integer.class)
                    .equal("traceId", "traceId", String.class)
                    .equal("requestId", "requestId", String.class)
                    .search("traceId", "traceId")
                    .search("requestId", "requestId")
                    .defaultSearch("traceId")
                    .sortable("occurredAt")
                    .sortable("durationMs")
                    .sortable("statusCode")
                    .rangePath("occurredAt")
                    .build();

    public static final Set<String> SORTABLE_FIELDS = FIELDS.sortableFields();

    private RequestLogSpecifications() {}

    public static Specification<RequestLog> forTenantFilters(UUID tenantId, ListQueryRequest query) {
        Specification<RequestLog> scoped =
                (root, criteriaQuery, cb) -> {
                    boolean isCountQuery =
                            criteriaQuery != null
                                    && criteriaQuery.getResultType() != null
                                    && (Long.class.equals(criteriaQuery.getResultType())
                                            || long.class.equals(criteriaQuery.getResultType()));
                    if (criteriaQuery != null && !isCountQuery) {
                        criteriaQuery.distinct(true);
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
                    return cb.and(preds.toArray(Predicate[]::new));
                };

        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }
}
