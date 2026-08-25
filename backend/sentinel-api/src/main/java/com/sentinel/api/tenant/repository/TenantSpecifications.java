package com.sentinel.api.tenant.repository;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.specification.GenericSpecifications;
import com.sentinel.api.common.specification.QueryFieldAllowlist;
import com.sentinel.common.postgresql.tenant.entity.Tenant;
import com.sentinel.common.postgresql.tenant.entity.TenantStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.Set;

public final class TenantSpecifications {

    public static final QueryFieldAllowlist FIELDS =
        QueryFieldAllowlist.builder()
            .equal("status", "status", TenantStatus.class)
            .search("name", "name")
            .search("slug", "slug")
            .defaultSearch("name")
            .sortable("createdAt")
            .sortable("name")
            .sortable("slug")
            .sortable("status")
            .rangePath("createdAt")
            .build();

    public static final Set<String> SORTABLE_FIELDS = FIELDS.sortableFields();

    private TenantSpecifications() {
    }

    public static Specification<Tenant> withFilters(ListQueryRequest query) {
        return GenericSpecifications.from(query, FIELDS);
    }
}
