package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.Endpoint;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EndpointRepository extends JpaRepository<Endpoint, UUID> {

    Optional<Endpoint> findByIdAndServiceId(UUID id, UUID serviceId);

    Optional<Endpoint> findByServiceIdAndMethodAndPathTemplate(
            UUID serviceId, String method, String pathTemplate);

    List<Endpoint> findByServiceIdOrderByMethodAscPathTemplateAsc(UUID serviceId);

    @Query(
            value =
                    """
                    SELECT e.* FROM endpoints e
                    INNER JOIN services s ON e.service_id = s.id
                    INNER JOIN products p ON s.product_id = p.id
                    WHERE e.id = :endpointId AND p.tenant_id = :tenantId
                    """,
            nativeQuery = true)
    Optional<Endpoint> findByIdAndTenantId(
            @Param("endpointId") UUID endpointId, @Param("tenantId") UUID tenantId);
}
