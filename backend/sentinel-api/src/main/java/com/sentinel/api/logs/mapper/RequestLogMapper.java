package com.sentinel.api.logs.mapper;

import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.api.logs.dto.response.RequestLogResponse;
import com.sentinel.api.product.entity.Product;
import com.sentinel.api.service.entity.Service;
import org.springframework.stereotype.Component;

@Component
public class RequestLogMapper {

    public RequestLogResponse toResponse(
            RequestLog log, Endpoint endpoint, Service service, Product product) {
        return new RequestLogResponse(
                log.getId(),
                log.getEndpointId(),
                log.getRequestId(),
                log.getTraceId(),
                log.getOccurredAt(),
                log.getEndUserIp(),
                log.getUserId(),
                log.getStatusCode(),
                log.getDurationMs(),
                log.getRequestSizeBytes(),
                log.getResponseSizeBytes(),
                log.getReceivedAt(),
                endpoint.getMethod(),
                endpoint.getPathTemplate(),
                service.getId(),
                service.getName(),
                product.getId(),
                product.getName());
    }
}
