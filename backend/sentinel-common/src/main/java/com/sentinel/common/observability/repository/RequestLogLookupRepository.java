package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.RequestLogLookup;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestLogLookupRepository extends CassandraRepository<RequestLogLookup, UUID> {
}