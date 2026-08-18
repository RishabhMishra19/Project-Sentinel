package com.sentinel.api.user.repository;

import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.specification.GenericSpecifications;
import com.sentinel.api.common.specification.QueryFieldAllowlist;
import com.sentinel.api.user.entity.User;
import com.sentinel.api.user.entity.UserStatus;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecifications {

    public static final QueryFieldAllowlist FIELDS =
            QueryFieldAllowlist.builder()
                    .equal("status", "status", UserStatus.class)
                    .search("email", "email")
                    .search("displayname", "displayName")
                    .search("display_name", "displayName")
                    .search("name", "displayName")
                    .defaultSearch("email")
                    .sortable("createdAt")
                    .sortable("email")
                    .sortable("displayName")
                    .sortable("status")
                    .rangePath("createdAt")
                    .build();

    public static final Set<String> SORTABLE_FIELDS = FIELDS.sortableFields();

    private UserSpecifications() {}

    public static Specification<User> withFilters(UUID tenantId, ListQueryRequest query) {
        Specification<User> scoped =
                (root, q, cb) ->
                        cb.and(
                                cb.equal(root.get("tenant").get("id"), tenantId),
                                cb.equal(root.get("sentinelAdmin"), false));
        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }
}
