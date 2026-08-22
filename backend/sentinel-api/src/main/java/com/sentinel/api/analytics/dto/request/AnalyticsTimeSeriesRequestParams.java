package com.sentinel.api.analytics.dto.request;

import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record AnalyticsTimeSeriesRequestParams(
        @NotNull AnalyticsBucket bucket,
        @NotNull AnalyticsScope scope,
        @NotNull Instant from,
        @NotNull Instant to,
        @NotNull UUID entityId
) {}

