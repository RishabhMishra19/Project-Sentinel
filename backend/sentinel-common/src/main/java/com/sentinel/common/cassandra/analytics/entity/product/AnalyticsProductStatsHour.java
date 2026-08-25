package com.sentinel.common.cassandra.analytics.entity.product;

import com.sentinel.common.cassandra.analytics.entity.AnalyticsStatsBase;
import com.sentinel.common.kafka.KafkaMessage;
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

@Table("analytics_product_stats_hour")
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsProductStatsHour extends AnalyticsStatsBase {

    public AnalyticsProductStatsHour(KafkaMessage.AnalyticsMetrics statsMetrics) {
        super(statsMetrics);
        this.id = new PrimaryKeyComposite();
        this.id.productId = statsMetrics.getEntityId();
        this.id.bucketStart = statsMetrics.getTimestamp();
    }

    @PrimaryKey
    private PrimaryKeyComposite id;

    @Getter
    @Setter
    @NoArgsConstructor
    @PrimaryKeyClass
    public static class PrimaryKeyComposite {

        @PrimaryKeyColumn(name = "product_id", type = PrimaryKeyType.PARTITIONED)
        private UUID productId;
        @PrimaryKeyColumn(name = "bucket_start", type = PrimaryKeyType.CLUSTERED)
        private Instant bucketStart;

    }

}