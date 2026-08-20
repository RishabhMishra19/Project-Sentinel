package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.EndpointLookup;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EndpointLookupRepository extends CassandraRepository<EndpointLookup, EndpointLookup.PrimaryKeyComposite> {

}
