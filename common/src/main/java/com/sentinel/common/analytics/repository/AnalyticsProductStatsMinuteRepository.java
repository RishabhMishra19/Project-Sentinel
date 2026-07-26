package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsProductStatsMinute;
import com.sentinel.common.analytics.entity.AnalyticsProductStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsProductStatsMinuteRepository extends JpaRepository<AnalyticsProductStatsMinute, AnalyticsProductStatsId> {}
