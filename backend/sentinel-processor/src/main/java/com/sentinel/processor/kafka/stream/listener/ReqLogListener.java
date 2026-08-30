package com.sentinel.processor.kafka.stream.listener;

import com.sentinel.common.cassandra.CassandraBatchInsertUtil;
import com.sentinel.common.cassandra.CassandraTables;
import com.sentinel.common.cassandra.requestlog.entity.RequestLog;
import com.sentinel.common.cassandra.requestlog.entity.RequestLogLookup;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import com.sentinel.processor.monitor.ListenerMetrics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
@RequiredArgsConstructor
public class ReqLogListener {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(ReqLogListener.class);
    private final ObjectMapper objectMapper;
    private final CassandraBatchInsertUtil cassandraBatchInsertUtil;
    private final ListenerMetrics listenerMetrics;


    @KafkaListener(topics = KafkaTopics.request_logs, groupId = KafkaTopics.request_logs + "_group")
    public void onReqLogsBatch(List<ConsumerRecord<String, String>> records) {
        if (records == null || records.isEmpty()) {
            return;
        }

        listenerMetrics.recordProcessing(KafkaTopics.request_logs, records.size(), () -> {
            List<RequestLog> requestLogs = new ArrayList<>(records.size());
            List<RequestLogLookup> requestLogLookups = new ArrayList<>(records.size());
            for (ConsumerRecord<String, String> record : records) {
                KafkaMessage.ReqLog reqLog = objectMapper.readValue(record.value(), KafkaMessage.ReqLog.class);
                requestLogs.add(this.toRequestLog(reqLog));
                requestLogLookups.add(this.toRequestLogLookup(reqLog));
            }
            // 1. Fire off both async execution flows in parallel
            CompletableFuture<CassandraBatchInsertUtil.BatchInsertResult> logsFuture = cassandraBatchInsertUtil.insertAsync(requestLogs);
            CompletableFuture<CassandraBatchInsertUtil.BatchInsertResult> lookupsFuture =
                cassandraBatchInsertUtil.insertAsync(requestLogLookups);

            // 2. Explicitly join them together and block the Kafka consumer thread until BOTH are finished
            CompletableFuture.allOf(logsFuture, lookupsFuture).join();

            CassandraBatchInsertUtil.BatchInsertResult logsResult = logsFuture.join();
            CassandraBatchInsertUtil.BatchInsertResult lookupsResult = lookupsFuture.join();

            listenerMetrics.recordCassandra(CassandraTables.request_logs, logsResult);
            listenerMetrics.recordCassandra(CassandraTables.request_logs_lookup_by_id, lookupsResult);

        });

    }

    private RequestLogLookup toRequestLogLookup(KafkaMessage.ReqLog reqLogKafkaMessage) {
        return RequestLogLookup.builder().requestLogId(reqLogKafkaMessage.requestLogId()).occurredAt(reqLogKafkaMessage.occurredAt())
            .build();
    }

    private RequestLog toRequestLog(KafkaMessage.ReqLog reqLog) {
        return RequestLog.builder()
            .id(new RequestLog.PrimaryKeyComposite(reqLog.tenantId(), reqLog.serviceId(), reqLog.occurredAt(), reqLog.requestLogId()))
            .endpointId(reqLog.endpointId()).requestId(reqLog.requestId()).traceId(reqLog.traceId()).endUserIp(reqLog.endUserIp())
            .userId(reqLog.userId()).statusCode(reqLog.statusCode()).durationMs(reqLog.durationMs())
            .requestSizeBytes(reqLog.requestSizeBytes()).responseSizeBytes(reqLog.responseSizeBytes()).build();
    }

}
