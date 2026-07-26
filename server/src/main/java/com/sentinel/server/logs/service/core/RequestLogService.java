package com.sentinel.server.logs.service.core;

import com.sentinel.server.observability.entity.RequestLog;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RequestLogService {

    Page<RequestLog> search(
            UUID tenantId,
            Instant from,
            Instant to,
            UUID productId,
            UUID serviceId,
            UUID endpointId,
            Integer statusCode,
            String statusClass,
            Integer minDurationMs,
            String traceId,
            String requestId,
            Pageable pageable);

    Optional<RequestLog> findByIdForTenant(UUID tenantId, UUID id);
}
