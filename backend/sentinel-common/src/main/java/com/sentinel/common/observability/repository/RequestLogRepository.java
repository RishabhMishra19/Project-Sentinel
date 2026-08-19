package com.sentinel.common.observability.repository;

import com.sentinel.common.observability.entity.RequestLog;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestLogRepository extends CassandraRepository<RequestLog, RequestLog.PrimaryKeyComposite> {

    @Query("SELECT * FROM request_logs WHERE tenant_id = ?0 AND service_id = ?1 LIMIT ?2")
    List<RequestLog> findFirstPage(UUID tenantId, UUID serviceId, int limit);

    @Query("SELECT * FROM request_logs WHERE tenant_id = ?0 AND service_id = ?1 AND (occurred_at, id) < (?2, ?3) ORDER BY occurred_at DESC LIMIT ?4")
    List<RequestLog> findNextPage(UUID tenantId, UUID serviceId, Instant lastOccurredAt, UUID lastRequestLogId, int limit);

    @Query("SELECT * FROM request_logs WHERE tenant_id = ?0 AND service_id = ?1 AND (occurred_at, id) > (?2, ?3) ORDER BY occurred_at ASC LIMIT ?4")
    List<RequestLog> findPrevPage(UUID tenantId, UUID serviceId, Instant lastOccurredAt, UUID lastRequestLogId, int limit);

    @Query("SELECT * FROM request_logs WHERE tenant_id = ?0 AND service_id = ?1 AND occurred_at = ?2 AND id = ?3")
    Optional<RequestLog> findByFullKey(UUID tenantId, UUID serviceId, Instant occurredAt, UUID requestLogId);
}