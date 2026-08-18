package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsEndpointExceptionMetric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsEndpointExceptionMetricRepository
        extends JpaRepository<AnalyticsEndpointExceptionMetric, AnalyticsEndpointExceptionMetric.Pk> {}
