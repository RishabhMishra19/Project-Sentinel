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
@Table(name = "analytics_endpoint_stats_hour")
@IdClass(AnalyticsEndpointStatsId.class)
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsEndpointStatsHour extends AnalyticsStatsMetrics {

    @Id
    @Column(name = "endpoint_id", nullable = false)
    private UUID endpointId;
}
