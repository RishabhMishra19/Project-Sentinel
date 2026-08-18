package com.sentinel.common.analytics.endpoint.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("analytics_endpoint_status_metrics")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsEndpointStatusMetric {

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Column("request_count")
    private long requestCount;

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(
            name = "endpoint_id",
            type = PrimaryKeyType.PARTITIONED
        )
        private UUID endpointId;

        @PrimaryKeyColumn(
            name = "bucket_start",
            type = PrimaryKeyType.CLUSTERED
        )
        private Instant bucketStart;

        @PrimaryKeyColumn(
            name = "status_code",
            type = PrimaryKeyType.CLUSTERED
        )
        private int statusCode;
    }
}