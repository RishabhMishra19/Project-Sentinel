package com.sentinel.processor.logs;

import com.sentinel.common.kafka.RequestLogKafkaMessage;
import com.sentinel.common.observability.entity.RequestLog;
import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestLogWriteService {
    private final CassandraTemplate cassandraTemplate;


    public void saveAll(List<RequestLogKafkaMessage> requestLogMessages) {
        if (requestLogMessages.isEmpty()) {
            return;
        }

        var batch = cassandraTemplate.batchOps();

        for (RequestLogKafkaMessage message : requestLogMessages) {
            for(RequestLogKafkaMessage.RequestLogKafkaMessageItem item: message.requestLogKafkaMessageItems()){
                RequestLog requestLog = RequestLog.builder()
                        .id(new RequestLog.PrimaryKeyComposite(
                                item.tenantId(),
                                item.serviceId(),
                                item.occurredAt(),
                                UUID.randomUUID()
                        ))
                        .endpointId(item.endpointId())
                        .requestId(item.requestId())
                        .traceId(item.traceId())
                        .endUserIp(item.endUserIp())
                        .userId(item.userId())
                        .statusCode(item.statusCode())
                        .durationMs(item.durationMs())
                        .requestSizeBytes(item.requestSizeBytes())
                        .responseSizeBytes(item.responseSizeBytes())
                        .build();

                batch.insert(requestLog);
            }
        }
        batch.execute();
    }

    public record ResolvedEvent(
            RequestLogKafkaMessage message,
            UUID endpointId
    ) {}
}