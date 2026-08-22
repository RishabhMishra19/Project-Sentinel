package com.sentinel.common.cassandra.analytics.entity.service;

import com.sentinel.common.cassandra.analytics.entity.AnalyticsStatsBase;
import com.sentinel.common.cassandra.analytics.dto.AnalyticsStatsMetrics;
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

@Table("analytics_service_stats_day")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsServiceStatsDay extends AnalyticsStatsBase {

    public AnalyticsServiceStatsDay(AnalyticsStatsMetrics statsMetrics, UUID serviceId, Instant startBucket) {
        super(statsMetrics);
        this.id = new PrimaryKeyComposite();
        this.id.serviceId = serviceId;
        this.id.bucketStart = startBucket;
    }

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(name = "service_id", type = PrimaryKeyType.PARTITIONED)
        private UUID serviceId;
        @PrimaryKeyColumn(name = "bucket_start", type = PrimaryKeyType.CLUSTERED)
        private Instant bucketStart;

    }

}