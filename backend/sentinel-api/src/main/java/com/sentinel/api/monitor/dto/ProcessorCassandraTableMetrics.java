package com.sentinel.api.monitor.dto;

public record ProcessorCassandraTableMetrics(MetricSeries writes, MetricSeries failures, MetricSeries latencyP95) {
}
