package com.sentinel.common.cassandra.requestlog.entity;

import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;

@Table("request_logs_lookup_by_id")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestLogLookup {

    @PrimaryKey("id")
    private UUID requestLogId;

    @Column("occurred_at")
    private Instant occurredAt;
}