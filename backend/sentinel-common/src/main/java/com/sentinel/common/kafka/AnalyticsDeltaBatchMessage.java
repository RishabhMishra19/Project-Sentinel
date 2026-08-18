package com.sentinel.common.kafka;

import java.util.List;

/** One Kafka record per ingest flush; contains all deltas for a partition key (serviceId). */
public record AnalyticsDeltaBatchMessage(List<AnalyticsDeltaMessage> deltas) {}
