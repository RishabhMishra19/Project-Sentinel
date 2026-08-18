package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.RequestLog;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;

public interface RequestLogRepository
        extends CassandraRepository<
        RequestLog,
        RequestLog.PrimaryKeyComposite> {

    Optional<RequestLog> findByIdServiceIdAndIdRequestLogId(
            UUID serviceId,
            UUID requestLogId);

    Slice<RequestLog> findByIdTenantIdAndIdServiceId(
            UUID tenantId,
            UUID serviceId,
            Pageable pageable);
}