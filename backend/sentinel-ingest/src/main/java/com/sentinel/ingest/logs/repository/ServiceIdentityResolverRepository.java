package com.sentinel.ingest.logs.repository;

import lombok.AllArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.UUID;

@Repository
@AllArgsConstructor
public class ServiceIdentityResolverRepository {

    private final JdbcTemplate jdbcTemplate;

    public ServiceIdentity resolveServiceIdentity(UUID serviceId) {
        return jdbcTemplate.query(
            """
                SELECT s.product_id, p.tenant_id
                FROM services s
                INNER JOIN products p ON p.id = s.product_id
                WHERE s.id = ? and s.status = 'ACTIVE' and p.status = 'ACTIVE'
                """,
            (rs, rowNum) -> new ServiceIdentity(
                serviceId,
                rs.getObject("product_id", UUID.class),
                rs.getObject("tenant_id", UUID.class)
            ),
            serviceId
        ).stream().findFirst().orElse(null);
    }

    public record ServiceIdentity(UUID serviceId, UUID productId, UUID tenantId) implements Serializable {
    }

}
