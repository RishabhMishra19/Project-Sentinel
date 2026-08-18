package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsServiceStatsMinute;
import com.sentinel.common.analytics.entity.AnalyticsServiceStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsServiceStatsMinuteRepository extends JpaRepository<AnalyticsServiceStatsMinute, AnalyticsServiceStatsId> {}
