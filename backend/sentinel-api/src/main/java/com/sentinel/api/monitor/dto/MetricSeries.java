package com.sentinel.api.monitor.dto;

import java.time.Instant;
import java.util.List;

public record MetricSeries(String name, List<MetricPoint> data) {
    public record MetricPoint(Instant timestamp, double value) {
    }

    public static MetricSeries empty(String name) {
        return new MetricSeries(
            name,
            List.of()
        );
    }
}
