package com.sentinel.server.logs.mapper;

import com.sentinel.server.logs.dto.response.RequestLogResponse;
import com.sentinel.server.observability.entity.Endpoint;
import com.sentinel.server.observability.entity.RequestLog;
import com.sentinel.server.product.entity.Product;
import com.sentinel.server.service.entity.Service;
import org.springframework.stereotype.Component;

@Component
public class RequestLogMapper {

    public RequestLogResponse toResponse(RequestLog log) {
        Endpoint endpoint = log.getEndpoint();
        Service service = endpoint.getService();
        Product product = service.getProduct();
        return new RequestLogResponse(
                log.getId(),
                log.getServiceInstance().getId(),
                endpoint.getId(),
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
