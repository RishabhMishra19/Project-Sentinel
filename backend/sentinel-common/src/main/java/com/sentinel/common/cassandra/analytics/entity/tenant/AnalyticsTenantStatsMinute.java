package com.sentinel.common.cassandra.analytics.entity.tenant;

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

@Table("analytics_tenant_stats_minute")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsTenantStatsMinute extends AnalyticsStatsBase {

    public AnalyticsTenantStatsMinute(AnalyticsStatsMetrics statsMetrics, UUID tenantId, Instant bucketStart) {
        super(statsMetrics);
        this.id = new PrimaryKeyComposite();
        this.id.tenantId = tenantId;
        this.id.bucketStart = bucketStart;
    }

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(name = "tenant_id", type = PrimaryKeyType.PARTITIONED)
        private UUID tenantId;
        @PrimaryKeyColumn(name = "bucket_start", type = PrimaryKeyType.CLUSTERED)
        private Instant bucketStart;

    }

}