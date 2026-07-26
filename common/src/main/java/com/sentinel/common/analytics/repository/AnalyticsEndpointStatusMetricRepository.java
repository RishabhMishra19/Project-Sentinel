package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsEndpointStatusMetric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsEndpointStatusMetricRepository
        extends JpaRepository<AnalyticsEndpointStatusMetric, AnalyticsEndpointStatusMetric.Pk> {}
