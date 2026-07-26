package com.sentinel.server.observability.repository;

import com.sentinel.server.observability.entity.Endpoint;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EndpointRepository extends JpaRepository<Endpoint, UUID> {

    Optional<Endpoint> findByIdAndServiceProductTenantId(UUID endpointId, UUID tenantId);

    @EntityGraph(attributePaths = {"service"})
    List<Endpoint> findByServiceIdAndServiceProductTenantIdOrderByMethodAscPathTemplateAsc(
            UUID serviceId, UUID tenantId);
}
