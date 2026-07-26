package com.sentinel.server.logs.service;

import com.sentinel.server.common.exception.BadRequestException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.logs.dto.response.RequestLogResponse;
import com.sentinel.server.logs.mapper.RequestLogMapper;
import com.sentinel.server.logs.service.core.RequestLogService;
import com.sentinel.server.observability.entity.RequestLog;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestLogFacadeImpl implements RequestLogFacade {

    private static final Duration MAX_RANGE = Duration.ofDays(7);

    private final RequestLogService requestLogService;
    private final RequestLogMapper requestLogMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<RequestLogResponse> list(
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
            Pageable pageable) {
        Instant rangeTo = to != null ? to : Instant.now();
        Instant rangeFrom = from != null ? from : rangeTo.minus(Duration.ofHours(1));
        validateRange(rangeFrom, rangeTo);

        Pageable effective =
                pageable.getSort().isSorted()
                        ? pageable
                        : PageRequest.of(
                                pageable.getPageNumber(),
                                pageable.getPageSize(),
                                Sort.by(Sort.Direction.DESC, "occurredAt"));

        Page<RequestLog> page =
                requestLogService.search(
                        tenantId,
                        rangeFrom,
                        rangeTo,
                        productId,
                        serviceId,
                        endpointId,
                        statusCode,
                        statusClass,
                        minDurationMs,
                        traceId,
                        requestId,
                        effective);
        return PageResponse.from(page.map(requestLogMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public RequestLogResponse getById(UUID tenantId, UUID id) {
        RequestLog log =
                requestLogService
                        .findByIdForTenant(tenantId, id)
                        .orElseThrow(() -> new ResourceNotFoundException("Request log not found"));
        return requestLogMapper.toResponse(log);
    }

    private void validateRange(Instant from, Instant to) {
        if (!from.isBefore(to)) {
            throw new BadRequestException("from must be before to");
        }
        if (Duration.between(from, to).compareTo(MAX_RANGE) > 0) {
            throw new BadRequestException("Logs time range cannot exceed 7 days");
        }
    }
}
