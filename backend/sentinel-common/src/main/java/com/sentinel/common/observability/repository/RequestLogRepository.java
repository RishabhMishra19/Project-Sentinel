package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.RequestLog;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface RequestLogRepository
        extends CassandraRepository<
        RequestLog,
        RequestLog.PrimaryKeyComposite> {

    Optional<RequestLog> findByIdServiceIdAndIdRequestLogId(
            UUID serviceId,
            UUID requestLogId);
}