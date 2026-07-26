package com.sentinel.server.analytics.entity;

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
@Table(name = "analytics_tenant_stats_minute")
@IdClass(AnalyticsTenantStatsId.class)
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsTenantStatsMinute extends AnalyticsStatsMetrics {

    @Id
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;
}
