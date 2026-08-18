package com.sentinel.common.analytics.endpoint.entity;

import com.sentinel.common.analytics.AnalyticsStatsMetrics;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Table("analytics_endpoint_stats_day")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsEndpointStatsDay extends AnalyticsStatsMetrics {

    @PrimaryKey
    private PrimaryKeyComposite id;

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
    }
}