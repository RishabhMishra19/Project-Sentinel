package com.sentinel.common.analytics.product.entity;

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

@Table("analytics_product_stats_day")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsProductStatsDay extends AnalyticsStatsMetrics {

    public AnalyticsProductStatsDay(AnalyticsStatsMetrics metrics, UUID productId, Instant startBucket) {
        super(metrics);
        this.id = new PrimaryKeyComposite();
        this.id.productId = productId;
        this.id.bucketStart = startBucket;
    }

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(
            name = "product_id",
            type = PrimaryKeyType.PARTITIONED
        )
        private UUID productId;

        @PrimaryKeyColumn(
            name = "bucket_start",
            type = PrimaryKeyType.CLUSTERED
        )
        private Instant bucketStart;
    }
}