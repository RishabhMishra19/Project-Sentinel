package com.sentinel.common.postgresql.endpoint.repository;

import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface EndpointRepository extends JpaRepository<Endpoint, UUID> {

    long countByServiceIdIn(List<UUID> serviceIds);

    List<Endpoint> findByIdIn(List<UUID> ids);

    List<UUID> findIdByServiceId(UUID serviceId);

    List<Endpoint> findByServiceId(UUID serviceId);

    List<Endpoint> findByServiceIdAndPathTemplateIn(UUID serviceId, Set<String> pathTemplateList);

}
