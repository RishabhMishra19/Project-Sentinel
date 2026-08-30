package com.sentinel.api.monitor.service;

import com.sentinel.api.monitor.dto.ProcessorKafkaStreamMetricsResponse;

import java.time.Instant;

public interface ProcessorKafkaStreamMetricService {

    ProcessorKafkaStreamMetricsResponse getKafkaStreamMetrics(String stream, Instant from, Instant to);

}
