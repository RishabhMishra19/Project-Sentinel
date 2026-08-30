package com.sentinel.api.monitor.service;

import com.sentinel.api.monitor.dto.ProcessorCassandraTableMetrics;
import com.sentinel.api.monitor.dto.ProcessorKafkaListenerMetrics;

import java.time.Instant;

public interface ProcessorMetricService {

    ProcessorKafkaListenerMetrics getListenerMetrics(String topic, Instant from, Instant to);
    ProcessorCassandraTableMetrics getCassandraMetrics(String table, Instant from, Instant to);

}
