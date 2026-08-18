package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.Endpoint;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface EndpointRepository
        extends CassandraRepository<
        Endpoint,
        Endpoint.PrimaryKeyComposite> {

    Optional<Endpoint> findByIdServiceIdAndIdEndpointId(
            UUID serviceId,
            UUID endpointId);

    List<Endpoint> findByIdServiceId(UUID serviceId);
}