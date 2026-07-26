package com.sentinel.server.logs.service.core;

import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.observability.entity.RequestLog;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RequestLogService {

    Page<RequestLog> search(UUID tenantId, ListQueryRequest query, Pageable pageable);

    Optional<RequestLog> findByIdForTenant(UUID tenantId, UUID id);
}
