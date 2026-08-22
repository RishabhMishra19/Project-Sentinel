package com.sentinel.api.analytics.dto.request;

import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record AnalyticsChildrenAggregatedRequestParams(
        @NotNull AnalyticsScope scope, @NotNull Instant from, @NotNull Instant to, UUID entityId
) {}
