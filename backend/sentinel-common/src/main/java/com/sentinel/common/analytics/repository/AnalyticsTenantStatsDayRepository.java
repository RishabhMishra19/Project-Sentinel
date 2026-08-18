package com.sentinel.common.analytics.repository;

import com.sentinel.common.analytics.entity.AnalyticsTenantStatsDay;
import com.sentinel.common.analytics.entity.AnalyticsTenantStatsId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsTenantStatsDayRepository extends JpaRepository<AnalyticsTenantStatsDay, AnalyticsTenantStatsId> {}
