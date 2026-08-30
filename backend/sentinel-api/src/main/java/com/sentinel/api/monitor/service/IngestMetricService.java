package com.sentinel.api.monitor.service;

import com.sentinel.api.monitor.dto.IngestApplicationMetricsResponse;
import com.sentinel.api.monitor.dto.IngestKafkaMetricsResponse;

import java.time.Instant;

public interface IngestMetricService {

    IngestApplicationMetricsResponse getIngestApplicationMetrics(Instant from, Instant to);

    IngestKafkaMetricsResponse getIngestKafkaMetrics(String topic, Instant from, Instant to);
}
