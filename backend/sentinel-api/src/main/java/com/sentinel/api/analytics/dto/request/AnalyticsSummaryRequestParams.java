package com.sentinel.api.analytics.dto.request;

import com.sentinel.common.analytics.AnalyticsScope;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record AnalyticsSummaryRequestParams(
        @NotNull AnalyticsScope scope, @NotNull Instant from, @NotNull Instant to, @NotNull UUID entityId
) {}

