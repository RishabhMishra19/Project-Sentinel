package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsEndpointStatsMinute;
import com.sentinel.common.analytics.entity.AnalyticsEndpointStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsEndpointStatsMinuteRepository extends JpaRepository<AnalyticsEndpointStatsMinute, AnalyticsEndpointStatsId> {}
