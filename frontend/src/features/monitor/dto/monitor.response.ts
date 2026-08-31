export type KafkaMetricPoint = {
    timestamp: string;
    value: number;
};

export type MetricSeries = {
    name: string;
    data: KafkaMetricPoint[];
};

export type ProcessorKafkaListenerMetrics = {
    polled: MetricSeries;
    failures: MetricSeries;
    batchProcessingLatencyP95: MetricSeries;
};

export type IngestAppMetricsResponse = {
    requests: MetricSeries;
    failures: MetricSeries;
    latencyP95: MetricSeries;
};

export type IngestKafkaMetricsResponse = {
    kafkaPublished: MetricSeries;
    kafkaPublishFailures: MetricSeries;
    kafkaPublishLatencyP95: MetricSeries;
};

export type ProcessorCassandraMetricsResponse = {
    writes: MetricSeries;
    failures: MetricSeries;
    latencyP95: MetricSeries;
};

export type ProcessorListenerMetricsResponse = {
    polled: MetricSeries;
    failures: MetricSeries;
    batchProcessingLatencyP95: MetricSeries;
};

export type ProcessorStreamsMetricsResponse = {
    stream: string;
    consumedPerSecond: MetricSeries;
    producedPerSecond: MetricSeries;
    pollRatePerSecond: MetricSeries;
    failedStreamThreads: MetricSeries;
};
