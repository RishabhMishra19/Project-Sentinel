package com.sentinel.api.service.repository;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.specification.GenericSpecifications;
import com.sentinel.api.common.specification.QueryFieldAllowlist;
import com.sentinel.common.postgresql.service.Service;
import com.sentinel.common.postgresql.service.ServiceStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.Set;
import java.util.UUID;

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

    private ServiceSpecifications() {
    }

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
