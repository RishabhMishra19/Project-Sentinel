package com.sentinel.server.logs.service;

import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.logs.dto.response.RequestLogResponse;
import java.time.Instant;
import java.util.UUID;
import org.springframework.data.domain.Pageable;

public interface RequestLogFacade {

    PageResponse<RequestLogResponse> list(
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

    RequestLogResponse getById(UUID tenantId, UUID id);
}
