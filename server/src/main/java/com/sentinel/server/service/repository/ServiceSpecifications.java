package com.sentinel.server.service.repository;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.specification.GenericSpecifications;
import com.sentinel.server.common.specification.QueryFieldAllowlist;
import com.sentinel.server.service.entity.Service;
import com.sentinel.server.service.entity.ServiceStatus;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class ServiceSpecifications {

    public static final QueryFieldAllowlist FIELDS =
            QueryFieldAllowlist.builder()
                    .equal("status", "status", ServiceStatus.class)
                    .search("name", "name")
                    .defaultSearch("name")
                    .sortable("createdAt")
                    .sortable("name")
                    .sortable("status")
                    .rangePath("createdAt")
                    .build();

    public static final Set<String> SORTABLE_FIELDS = FIELDS.sortableFields();

    private ServiceSpecifications() {}

    public static Specification<Service> withFilters(UUID productId, ListQueryRequest query) {
        Specification<Service> scoped =
                (root, q, cb) -> cb.equal(root.get("product").get("id"), productId);
        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }

    public static Specification<Service> forTenant(UUID tenantId, ListQueryRequest query) {
        Specification<Service> scoped =
                (root, q, cb) -> cb.equal(root.get("product").get("tenant").get("id"), tenantId);
        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }
}
