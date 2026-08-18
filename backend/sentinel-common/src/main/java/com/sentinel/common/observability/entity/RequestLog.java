package com.sentinel.common.observability.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "request_logs")
@Getter
@Setter
@NoArgsConstructor
public class RequestLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "service_instance_id", nullable = false)
    private UUID serviceInstanceId;

    @Column(name = "endpoint_id", nullable = false)
    private UUID endpointId;

    @Column(name = "request_id", nullable = true, length = 128)
    private String requestId;

    @Column(name = "trace_id", nullable = true, length = 128)
    private String traceId;

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt;

    @Column(name = "end_user_ip", nullable = true, length = 64)
    private String endUserIp;

    @Column(name = "user_id", nullable = true, length = 128)
    private String userId;

    @Column(name = "status_code", nullable = false)
    private int statusCode;

    @Column(name = "duration_ms", nullable = false)
    private int durationMs;

    @Column(name = "request_size_bytes", nullable = true)
    private Integer requestSizeBytes;

    @Column(name = "response_size_bytes", nullable = true)
    private Integer responseSizeBytes;

    @Column(name = "received_at", nullable = false)
    private Instant receivedAt;
}
