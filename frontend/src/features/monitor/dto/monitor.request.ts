export interface MetricRequest {
    from: string;
    to: string;
}

export interface KafkaMetricsRequest extends MetricRequest {
    topic: string;
}

export interface KafkaStreamsMetricsRequest extends MetricRequest {
    stream: string;
}

export interface CassandraMetricsRequest extends MetricRequest {
    table: string;
}
