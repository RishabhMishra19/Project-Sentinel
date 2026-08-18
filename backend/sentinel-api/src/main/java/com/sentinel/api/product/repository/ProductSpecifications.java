package com.sentinel.api.product.repository;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.specification.GenericSpecifications;
import com.sentinel.server.common.specification.QueryFieldAllowlist;
import com.sentinel.server.product.entity.Product;
import com.sentinel.server.product.entity.ProductStatus;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    public static final QueryFieldAllowlist FIELDS =
            QueryFieldAllowlist.builder()
                    .equal("status", "status", ProductStatus.class)
                    .search("name", "name")
                    .defaultSearch("name")
                    .sortable("createdAt")
                    .sortable("name")
                    .sortable("status")
                    .rangePath("createdAt")
                    .build();

    public static final Set<String> SORTABLE_FIELDS = FIELDS.sortableFields();

    private ProductSpecifications() {}

    public static Specification<Product> withFilters(UUID tenantId, ListQueryRequest query) {
        Specification<Product> scoped =
                (root, q, cb) -> cb.equal(root.get("tenant").get("id"), tenantId);
        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }
}
