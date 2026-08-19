package com.sentinel.api.logs.mapper;

import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.api.logs.dto.response.RequestLogListResponse;
import com.sentinel.api.product.entity.Product;
import com.sentinel.api.service.entity.Service;
import org.springframework.stereotype.Component;

@Component
public class RequestLogMapper {

    public RequestLogListResponse toResponse(
            RequestLog log, Endpoint endpoint, Service service, Product product) {
        return new RequestLogListResponse(
                log.getId().getRequestLogId(),
                log.getEndpointId(),
                log.getRequestId(),
                log.getTraceId(),
                log.getId().getOccurredAt(),
                log.getEndUserIp(),
                log.getUserId(),
                log.getStatusCode(),
                log.getDurationMs(),
                log.getRequestSizeBytes(),
                log.getResponseSizeBytes(),
                endpoint.getMethod(),
                endpoint.getPathTemplate(),
                service.getId(),
                service.getName(),
                product.getId(),
                product.getName());
    }
}
