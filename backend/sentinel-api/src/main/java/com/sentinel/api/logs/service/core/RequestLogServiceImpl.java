package com.sentinel.api.logs.service.core;

import com.sentinel.api.logs.dto.RequestLogCursorEncoder;
import com.sentinel.api.logs.dto.request.GetRequestLogsListRequest;
import com.sentinel.common.cassandra.requestlog.entity.RequestLog;
import com.sentinel.common.cassandra.requestlog.entity.RequestLogLookup;
import com.sentinel.common.cassandra.requestlog.repository.RequestLogLookupRepository;
import com.sentinel.common.cassandra.requestlog.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RequestLogServiceImpl implements RequestLogService {

    private final RequestLogRepository requestLogRepository;
    private final RequestLogLookupRepository requestLogLookupRepository;


    @Override
    public Optional<RequestLog> getLogById(UUID tenantId, UUID serviceId, UUID requestLogId) {
        Optional<RequestLogLookup> lookupOpt = requestLogLookupRepository.findById(requestLogId);
        if (lookupOpt.isEmpty()) {
            return Optional.empty();
        }
        RequestLogLookup lookup = lookupOpt.get();
        return requestLogRepository.findByFullKey(
                tenantId,
                serviceId,
                lookup.getOccurredAt(),
                lookup.getRequestLogId()
        );
    }

    @Override
    public List<RequestLog> getFirstPage(GetRequestLogsListRequest request) {
        return requestLogRepository.findFirstPage(
                request.getTenantId(),
                request.getServiceId(),
                request.getPageSize()
        );
    }

    @Override
    public List<RequestLog> getNextPage(GetRequestLogsListRequest request, RequestLogCursorEncoder.RequestLogCursor decodedCursor) {
        return requestLogRepository.findNextPage(
                request.getTenantId(),
                request.getServiceId(),
                decodedCursor.getOccurredAt(),
                decodedCursor.getRequestLogId(),
                request.getPageSize()
        );
    }

    @Override
    public List<RequestLog> getPrevPage(GetRequestLogsListRequest request, RequestLogCursorEncoder.RequestLogCursor decodedCursor) {
        return requestLogRepository.findPrevPage(
                request.getTenantId(),
                request.getServiceId(),
                decodedCursor.getOccurredAt(),
                decodedCursor.getRequestLogId(),
                request.getPageSize()
        );
    }
}
