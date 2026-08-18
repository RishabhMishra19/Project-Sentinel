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
    public Slice<RequestLog> findAllPaginated(UUID tenantId, RequestLogListRequest request) {
        return requestLogRepository.findByIdTenantIdAndIdServiceId(
                        tenantId,
                        request.getServiceId(),
                        request.toPageRequest()
                );
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RequestLog> findByIdForTenant(UUID serviceId, UUID id) {

        return requestLogRepository.findByIdServiceIdAndIdRequestLogId(serviceId, id);
    }
}
