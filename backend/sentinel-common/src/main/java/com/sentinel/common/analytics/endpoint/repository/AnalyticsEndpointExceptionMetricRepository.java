package com.sentinel.common.analytics.endpoint.repository;

import com.sentinel.common.analytics.endpoint.entity.AnalyticsEndpointExceptionMetric;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface AnalyticsEndpointExceptionMetricRepository
        extends CassandraRepository<AnalyticsEndpointExceptionMetric,
            AnalyticsEndpointExceptionMetric.PrimaryKeyComposite> {
}