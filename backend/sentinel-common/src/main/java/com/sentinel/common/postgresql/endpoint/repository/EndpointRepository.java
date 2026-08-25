package com.sentinel.common.postgresql.endpoint.repository;

import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface EndpointRepository extends JpaRepository<Endpoint, UUID> {

    long countByServiceIdIn(List<UUID> serviceIds);

    List<Endpoint> findByIdIn(List<UUID> ids);

    @Query("SELECT e.id FROM Endpoint e WHERE e.serviceId = :serviceId")
    List<UUID> findIdByServiceId(@Param("serviceId") UUID serviceId);

    List<Endpoint> findByServiceId(UUID serviceId);

    List<Endpoint> findByServiceIdAndPathTemplateIn(UUID serviceId, Set<String> pathTemplateList);

    List<Endpoint> findByServiceIdIn(List<UUID> serviceIds);

}
