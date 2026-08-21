package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.Endpoint;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;

public interface EndpointRepository
        extends CassandraRepository<
        Endpoint,
        Endpoint.PrimaryKeyComposite> {

    Optional<Endpoint> findById_ServiceIdAndId_EndpointId(
            UUID serviceId,
            UUID endpointId);

    List<Endpoint> findById_ServiceId(UUID serviceId);

    List<Endpoint> findById_ServiceIdIn(List<UUID> serviceIds);

    long countById_ServiceIdIn(List<UUID> serviceIds);

    @Query("""
        SELECT *
        FROM endpoints
        WHERE service_id = ?0
          AND id IN ?1
    """)
    List<Endpoint> findByServiceIdAndEndpointIdIn(
            UUID serviceId,
            List<UUID> endpointIds);

    List<UUID> findIdByServiceId(UUID serviceId);

    @Query("SELECT id FROM endpoints")
    List<UUID> findAllIds();

}