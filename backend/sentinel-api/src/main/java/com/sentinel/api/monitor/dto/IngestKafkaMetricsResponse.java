package com.sentinel.api.monitor.dto;

public record IngestKafkaMetricsResponse(
    MetricSeries kafkaPublished,
    MetricSeries kafkaPublishFailures,
    MetricSeries kafkaPublishLatencyP95
) {
}
