package com.sentinel.common.cassandra.requestlog.repository;

import com.sentinel.common.cassandra.requestlog.entity.RequestLogLookup;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestLogLookupRepository extends CassandraRepository<RequestLogLookup, UUID> {
}