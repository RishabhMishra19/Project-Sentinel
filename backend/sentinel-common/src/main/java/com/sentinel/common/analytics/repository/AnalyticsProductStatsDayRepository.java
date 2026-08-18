package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsProductStatsDay;
import com.sentinel.common.analytics.entity.AnalyticsProductStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsProductStatsDayRepository extends JpaRepository<AnalyticsProductStatsDay, AnalyticsProductStatsId> {}
