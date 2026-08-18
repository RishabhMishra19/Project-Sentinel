package com.sentinel.common.observability.entity;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

@Table("endpoints")
@Getter
@Setter
@NoArgsConstructor
public class Endpoint {

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Column("method")
    private String method;

    @Column("path_template")
    private String pathTemplate;

    @Column("first_seen_at")
    private Instant firstSeenAt;

    @Column("last_seen_at")
    private Instant lastSeenAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    @AllArgsConstructor
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(
                name = "service_id",
                type = PrimaryKeyType.PARTITIONED
        )
        private UUID serviceId;

        @PrimaryKeyColumn(
                name = "id",
                type = PrimaryKeyType.CLUSTERED
        )
        private UUID endpointId;
    }
}