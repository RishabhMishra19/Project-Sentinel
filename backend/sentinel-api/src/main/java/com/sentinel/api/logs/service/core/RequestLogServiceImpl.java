package com.sentinel.api.logs.service.core;

import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.common.observability.repository.RequestLogRepository;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.observability.repository.RequestLogSpecifications;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestLogServiceImpl implements RequestLogService {

    private final RequestLogRepository requestLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<RequestLog> search(UUID tenantId, ListQueryRequest query, Pageable pageable) {
        Specification<RequestLog> spec =
                RequestLogSpecifications.forTenantFilters(tenantId, query);
        return requestLogRepository.findAll(spec, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RequestLog> findByIdForTenant(UUID tenantId, UUID id) {
        return requestLogRepository.findByIdAndTenantId(id, tenantId);
    }
}
