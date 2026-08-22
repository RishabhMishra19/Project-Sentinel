package com.sentinel.common.analytics.entity.endpoint;

import com.sentinel.common.analytics.entity.AnalyticsStatsBase;
import com.sentinel.common.analytics.dto.AnalyticsStatsMetrics;
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

@Table("analytics_endpoint_stats_minute")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsEndpointStatsMinute extends AnalyticsStatsBase {

    @PrimaryKey
    private PrimaryKeyComposite id;

    public AnalyticsEndpointStatsMinute(AnalyticsStatsMetrics statsMetrics, UUID endpointId, Instant bucketStart) {
        super(statsMetrics);
        this.id = new PrimaryKeyComposite();
        this.id.endpointId = endpointId;
        this.id.bucketStart = bucketStart;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(name = "endpoint_id", type = PrimaryKeyType.PARTITIONED)
        private UUID endpointId;
        @PrimaryKeyColumn(name = "bucket_start", type = PrimaryKeyType.CLUSTERED)
        private Instant bucketStart;

    }

}