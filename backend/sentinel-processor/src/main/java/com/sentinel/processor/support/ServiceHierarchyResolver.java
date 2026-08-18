package com.sentinel.processor.support;

import com.sentinel.processor.config.WorkerCacheConfig;
import java.util.UUID;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ServiceHierarchyResolver {

    private final JdbcTemplate jdbcTemplate;

    public ServiceHierarchyResolver(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Cacheable(cacheNames = WorkerCacheConfig.SERVICE_HIERARCHY_CACHE, key = "#serviceId")
    public ServiceHierarchy resolve(UUID serviceId) {
        return jdbcTemplate.query(
                """
                SELECT s.product_id, p.tenant_id
                FROM services s
                INNER JOIN products p ON p.id = s.product_id
                WHERE s.id = ?
                """,
                rs -> {
                    if (!rs.next()) {
                        throw new IllegalStateException("Service not found: " + serviceId);
                    }
                    return new ServiceHierarchy(
                            (UUID) rs.getObject("product_id"),
                            (UUID) rs.getObject("tenant_id"));
                },
                serviceId);
    }
}
