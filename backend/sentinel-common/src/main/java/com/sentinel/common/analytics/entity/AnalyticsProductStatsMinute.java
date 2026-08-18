package com.sentinel.common.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "analytics_product_stats_minute")
@IdClass(AnalyticsProductStatsId.class)
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsProductStatsMinute extends AnalyticsStatsMetrics {

    @Id
    @Column(name = "product_id", nullable = false)
    private UUID productId;
}
