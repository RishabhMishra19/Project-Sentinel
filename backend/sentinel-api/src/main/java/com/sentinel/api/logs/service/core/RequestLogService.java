package com.sentinel.api.logs.service.core;

import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.server.common.query.ListQueryRequest;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RequestLogService {

    Page<RequestLog> search(UUID tenantId, ListQueryRequest query, Pageable pageable);

    Optional<RequestLog> findByIdForTenant(UUID tenantId, UUID id);
}
