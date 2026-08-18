package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.RequestLog;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestLogRepository
        extends JpaRepository<RequestLog, UUID>, JpaSpecificationExecutor<RequestLog> {

    @Query(
            value =
                    """
                    SELECT r.* FROM request_logs r
                    INNER JOIN endpoints e ON r.endpoint_id = e.id
                    INNER JOIN services s ON e.service_id = s.id
                    INNER JOIN products p ON s.product_id = p.id
                    WHERE r.id = :id AND p.tenant_id = :tenantId
                    """,
            nativeQuery = true)
    Optional<RequestLog> findByIdAndTenantId(@Param("id") UUID id, @Param("tenantId") UUID tenantId);
}
