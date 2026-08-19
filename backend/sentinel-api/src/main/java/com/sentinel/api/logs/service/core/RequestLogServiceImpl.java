package com.sentinel.api.logs.service.core;

import com.sentinel.api.logs.dto.request.RequestLogListRequest;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.common.observability.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestLogServiceImpl implements RequestLogService {

    private final RequestLogRepository requestLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Slice<RequestLog> findAllPaginated(UUID tenantId, UUID serviceId, RequestLogListRequest request) {
        return requestLogRepository.findByIdTenantIdAndIdServiceId(
                        tenantId,
                        serviceId,
                        request.toPageRequest()
                );
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RequestLog> findByTenantServiceAndId(UUID tenantId, UUID serviceId, UUID id) {
        return requestLogRepository.findByIdTenantIdAndIdServiceIdAndIdRequestLogId(tenantId, serviceId, id);
    }
}
