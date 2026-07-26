package com.sentinel.worker.logs;

import com.sentinel.common.kafka.RequestEventMessage;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class RequestLogWriteService {

    private static final String INSERT_SQL =
            """
            INSERT INTO request_logs (
                id, service_instance_id, endpoint_id, request_id, trace_id,
                occurred_at, end_user_ip, user_id, status_code, duration_ms,
                request_size_bytes, response_size_bytes, received_at
            ) VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

    private final JdbcTemplate jdbcTemplate;

    public RequestLogWriteService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveAll(List<ResolvedEvent> events) {
        if (events.isEmpty()) {
            return;
        }
        jdbcTemplate.batchUpdate(
                INSERT_SQL,
                events,
                events.size(),
                (ps, event) -> {
                    RequestEventMessage message = event.message();
                    ps.setObject(1, UUID.randomUUID());
                    ps.setObject(2, message.serviceInstanceId());
                    ps.setObject(3, event.endpointId());
                    ps.setString(4, message.requestId());
                    ps.setTimestamp(5, Timestamp.from(message.occurredAt()));
                    ps.setString(6, message.endUserIp());
                    ps.setString(7, message.userId());
                    ps.setInt(8, message.statusCode());
                    ps.setInt(9, message.durationMs());
                    ps.setObject(10, message.requestSizeBytes());
                    ps.setObject(11, message.responseSizeBytes());
                    ps.setTimestamp(12, Timestamp.from(message.receivedAt()));
                });
    }

    public record ResolvedEvent(RequestEventMessage message, UUID endpointId) {}
}
