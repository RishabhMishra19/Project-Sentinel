package com.sentinel.api.logs.service.core;

import com.sentinel.api.logs.dto.request.RequestLogListRequest;
import com.sentinel.common.observability.entity.RequestLog;
import org.springframework.data.domain.Slice;

import java.util.Optional;
import java.util.UUID;

public interface RequestLogService {

    Slice<RequestLog> findAllPaginated(UUID tenantId, RequestLogListRequest request);

    Optional<RequestLog> findByIdForTenant( UUID serviceId, UUID id);
}
