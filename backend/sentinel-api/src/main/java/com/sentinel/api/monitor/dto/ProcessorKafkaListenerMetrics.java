package com.sentinel.api.monitor.dto;

public record ProcessorKafkaListenerMetrics(MetricSeries polled, MetricSeries failures, MetricSeries batchProcessingLatencyP95) {
}
