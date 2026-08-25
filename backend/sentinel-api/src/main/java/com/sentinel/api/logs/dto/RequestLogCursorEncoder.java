package com.sentinel.api.logs.dto;

import com.sentinel.common.cassandra.paginator.CursorEncoder;
import com.sentinel.common.cassandra.requestlog.entity.RequestLog;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import java.util.regex.Pattern;

@Slf4j
@AllArgsConstructor
@Getter
@Setter
@Component
public class RequestLogCursorEncoder implements CursorEncoder<RequestLog, RequestLogCursorEncoder.RequestLogCursor> {

    private final String DELIMITER = "|";

    @Override
    public String encode(RequestLog entity) {
        StringBuilder sb = new StringBuilder();
        sb.append(entity.getId().getRequestLogId());
        sb.append(DELIMITER);
        sb.append(entity.getId().getOccurredAt().toEpochMilli());
        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public RequestLogCursorEncoder.RequestLogCursor decode(String value) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException("Invalid cursor");
        }
        try {
            String decoded = new String(
                Base64.getDecoder().decode(value)
            );
            String[] values = decoded.split(
                Pattern.quote(DELIMITER),
                -1
            );
            if (values.length != 2) {
                throw new IllegalArgumentException("Invalid cursor");
            }
            UUID requestLogId = UUID.fromString(values[0]);
            Instant occurredAt = Instant.ofEpochMilli(Long.parseLong(values[1]));
            return new RequestLogCursor(requestLogId, occurredAt);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new IllegalArgumentException("Invalid cursor");
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Setter
    public static class RequestLogCursor {
        private UUID requestLogId;
        private Instant occurredAt;
    }
}
