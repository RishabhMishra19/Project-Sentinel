package com.sentinel.server.observability.repository;

import com.sentinel.server.observability.entity.RequestLog;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestLogRepository
        extends JpaRepository<RequestLog, UUID>, JpaSpecificationExecutor<RequestLog> {

    @Query(
            """
            SELECT r FROM RequestLog r
            JOIN FETCH r.endpoint e
            JOIN FETCH e.service s
            JOIN FETCH s.product p
            JOIN FETCH r.serviceInstance
            WHERE r.id = :id AND p.tenant.id = :tenantId
            """)
    Optional<RequestLog> findByIdAndTenantId(@Param("id") UUID id, @Param("tenantId") UUID tenantId);
}
