package com.sentinel.api.observability.repository;

import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.specification.GenericSpecifications;
import com.sentinel.api.common.specification.QueryFieldAllowlist;
import com.sentinel.api.product.entity.Product;
import com.sentinel.api.service.entity.Service;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class RequestLogSpecifications {

    public static final QueryFieldAllowlist FIELDS =
            QueryFieldAllowlist.builder()
                    .equal("endpointId", "endpointId", UUID.class)
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
                    Subquery<UUID> endpointIds = criteriaQuery.subquery(UUID.class);
                    Root<Endpoint> endpoint = endpointIds.from(Endpoint.class);
                    Root<Service> service = endpointIds.from(Service.class);
                    Root<Product> product = endpointIds.from(Product.class);

                    endpointIds
                            .select(endpoint.get("id"))
                            .where(
                                    cb.equal(endpoint.get("serviceId"), service.get("id")),
                                    cb.equal(service.get("product"), product),
                                    cb.equal(product.get("tenant").get("id"), tenantId));

                    Predicate tenantScope = root.get("endpointId").in(endpointIds);

                    UUID productIdFilter = readUuid(query, "productId");
                    UUID serviceIdFilter = readUuid(query, "serviceId");

                    if (productIdFilter != null || serviceIdFilter != null) {
                        Subquery<UUID> filteredEndpoints = criteriaQuery.subquery(UUID.class);
                        Root<Endpoint> ep = filteredEndpoints.from(Endpoint.class);
                        Root<Service> svc = filteredEndpoints.from(Service.class);
                        filteredEndpoints.select(ep.get("id"));
                        Predicate join = cb.equal(ep.get("serviceId"), svc.get("id"));
                        if (serviceIdFilter != null) {
                            filteredEndpoints.where(
                                    join, cb.equal(svc.get("id"), serviceIdFilter));
                        } else {
                            filteredEndpoints.where(
                                    join, cb.equal(svc.get("product").get("id"), productIdFilter));
                        }
                        return cb.and(tenantScope, root.get("endpointId").in(filteredEndpoints));
                    }

                    return tenantScope;
                };

        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }

    private static UUID readUuid(ListQueryRequest query, String field) {
        String raw = query != null ? query.firstFilterValue(field) : null;
        if (!StringUtils.hasText(raw)) {
            return null;
        }
        try {
            return UUID.fromString(raw.trim());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
