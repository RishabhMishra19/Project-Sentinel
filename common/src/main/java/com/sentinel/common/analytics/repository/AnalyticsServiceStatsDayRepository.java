package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsServiceStatsDay;
import com.sentinel.common.analytics.entity.AnalyticsServiceStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsServiceStatsDayRepository extends JpaRepository<AnalyticsServiceStatsDay, AnalyticsServiceStatsId> {}
