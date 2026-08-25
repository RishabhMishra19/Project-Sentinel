package com.sentinel.common.cassandra.requestlog.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("request_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestLog {

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Column("endpoint_id")
    private UUID endpointId;

    @Column("request_id")
    private String requestId;

    @Column("trace_id")
    private String traceId;

    @Column("end_user_ip")
    private String endUserIp;

    @Column("user_id")
    private String userId;

    @Column("status_code")
    private int statusCode;

    @Column("duration_ms")
    private int durationMs;

    @Column("request_size_bytes")
    private Integer requestSizeBytes;

    @Column("response_size_bytes")
    private Integer responseSizeBytes;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(name = "tenant_id", type = PrimaryKeyType.PARTITIONED)
        private UUID tenantId;

        @PrimaryKeyColumn(name = "service_id", type = PrimaryKeyType.PARTITIONED)
        private UUID serviceId;

        @PrimaryKeyColumn(name = "occurred_at", type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
        private Instant occurredAt;

        @PrimaryKeyColumn(name = "id", type = PrimaryKeyType.CLUSTERED, ordering = Ordering.DESCENDING)
        private UUID requestLogId;
    }
}
