package com.sentinel.api.monitor.dto;

public record ProcessorKafkaStreamMetricsResponse(String stream, MetricSeries consumedPerSecond, MetricSeries producedPerSecond,
                                                  MetricSeries pollRatePerSecond, MetricSeries failedStreamThreads) {
}
