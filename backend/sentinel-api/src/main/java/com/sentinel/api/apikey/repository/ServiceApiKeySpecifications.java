package com.sentinel.api.apikey.repository;

import com.sentinel.common.apikey.entity.ServiceApiKey;
import com.sentinel.common.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.specification.GenericSpecifications;
import com.sentinel.server.common.specification.QueryFieldAllowlist;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class ServiceApiKeySpecifications {

    public static final QueryFieldAllowlist FIELDS =
            QueryFieldAllowlist.builder()
                    .equal("status", "status", ServiceApiKeyStatus.class)
                    .sortable("createdAt")
                    .sortable("name")
                    .sortable("status")
                    .build();

    public static final Set<String> SORTABLE_FIELDS = FIELDS.sortableFields();

    private ServiceApiKeySpecifications() {}

    public static Specification<ServiceApiKey> forService(UUID serviceId, ListQueryRequest query) {
        Specification<ServiceApiKey> scoped =
                (root, q, cb) -> cb.equal(root.get("serviceId"), serviceId);
        return scoped.and(GenericSpecifications.from(query, FIELDS));
    }
}
