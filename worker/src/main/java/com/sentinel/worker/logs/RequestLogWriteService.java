package com.sentinel.worker.logs;

import com.sentinel.common.kafka.RequestEventMessage;
import com.sentinel.common.observability.entity.RequestLog;
import com.sentinel.common.observability.repository.RequestLogRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class RequestLogWriteService {

    private final RequestLogRepository requestLogRepository;

    public RequestLogWriteService(RequestLogRepository requestLogRepository) {
        this.requestLogRepository = requestLogRepository;
    }

    public void saveAll(List<ResolvedEvent> events) {
        if (events.isEmpty()) {
            return;
        }
        List<RequestLog> logs = new ArrayList<>(events.size());
        for (ResolvedEvent event : events) {
            RequestEventMessage message = event.message();
            RequestLog log = new RequestLog();
            log.setServiceInstanceId(message.serviceInstanceId());
            log.setEndpointId(event.endpointId());
            log.setRequestId(message.requestId());
            log.setOccurredAt(message.occurredAt());
            log.setEndUserIp(message.endUserIp());
            log.setUserId(message.userId());
            log.setStatusCode(message.statusCode());
            log.setDurationMs(message.durationMs());
            log.setRequestSizeBytes(message.requestSizeBytes());
            log.setResponseSizeBytes(message.responseSizeBytes());
            log.setReceivedAt(message.receivedAt());
            logs.add(log);
        }
        requestLogRepository.saveAll(logs);
    }

    public record ResolvedEvent(RequestEventMessage message, UUID endpointId) {}
}
