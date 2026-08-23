package com.sentinel.processor.kafka.listener.requestlog;

import com.sentinel.common.cassandra.requestlog.entity.RequestLogLookup;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import com.sentinel.common.cassandra.requestlog.entity.RequestLog;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.cassandra.core.CassandraBatchOperations;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ReqLogListener {
    private static final Logger log = LoggerFactory.getLogger(ReqLogListener.class);

    private final ObjectMapper objectMapper;
    private final CassandraTemplate cassandraTemplate;


    @KafkaListener(topics = KafkaTopics.request_logs, containerFactory = "sentinelKafkaListenerContainerFactory", groupId = KafkaTopics.request_logs+"_group")
    public void onReqLogsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }
        List<RequestLog> requestLogs = new ArrayList<>();
        List<RequestLogLookup> requestLogLookups = new ArrayList<>();
        for (ConsumerRecord<String, String> record : records) {
            KafkaMessage.ReqLog reqLogKafkaMessage = objectMapper.readValue(record.value(), KafkaMessage.ReqLog.class);
            requestLogs.add(this.toRequestLog(reqLogKafkaMessage));
            requestLogLookups.add(this.toRequestLogLookup(reqLogKafkaMessage));
        }
        try {
            CassandraBatchOperations batchOperations = cassandraTemplate.batchOps();
            requestLogs.forEach(batchOperations::insert);
            requestLogLookups.forEach(batchOperations::insert);
            batchOperations.execute();
        }catch (Exception e) {
            log.error("Failed processing Kafka batch", e);
            throw e;
        }
    }

    private RequestLogLookup toRequestLogLookup(KafkaMessage.ReqLog reqLogKafkaMessage) {
        return RequestLogLookup.builder()
                .requestLogId(reqLogKafkaMessage.requestLogId())
                .occurredAt(reqLogKafkaMessage.occurredAt())
                .build();
    }

    private RequestLog toRequestLog(KafkaMessage.ReqLog reqLog) {
        return RequestLog.builder()
                .id(new RequestLog.PrimaryKeyComposite(
                        reqLog.tenantId(),
                        reqLog.serviceId(),
                        reqLog.occurredAt(),
                        reqLog.requestLogId()
                ))
                .endpointId(reqLog.endpointId())
                .requestId(reqLog.requestId())
                .traceId(reqLog.traceId())
                .endUserIp(reqLog.endUserIp())
                .userId(reqLog.userId())
                .statusCode(reqLog.statusCode())
                .durationMs(reqLog.durationMs())
                .requestSizeBytes(reqLog.requestSizeBytes())
                .responseSizeBytes(reqLog.responseSizeBytes())
                .build();
    }
}
