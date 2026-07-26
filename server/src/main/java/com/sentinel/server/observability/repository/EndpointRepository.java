package com.sentinel.server.observability.repository;

import com.sentinel.server.observability.entity.Endpoint;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EndpointRepository extends JpaRepository<Endpoint, UUID> {

    @Query(
            """
            SELECT e FROM Endpoint e
            JOIN e.service s
            JOIN s.product p
            WHERE e.id = :endpointId AND p.tenant.id = :tenantId
            """)
    Optional<Endpoint> findByIdAndTenantId(@Param("endpointId") UUID endpointId, @Param("tenantId") UUID tenantId);
}
