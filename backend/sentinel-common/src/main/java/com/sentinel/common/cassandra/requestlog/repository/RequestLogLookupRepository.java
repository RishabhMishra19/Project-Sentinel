package com.sentinel.common.cassandra.requestlog.repository;

import com.sentinel.common.cassandra.requestlog.entity.RequestLogLookup;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RequestLogLookupRepository extends CassandraRepository<RequestLogLookup, UUID> {
}
