package com.sentinel.api.monitor.dto;

public record IngestApplicationMetricsResponse(
    MetricSeries requests,
    MetricSeries failures,
    MetricSeries latencyP95
) {
}
