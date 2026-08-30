package com.sentinel.api.monitor.service.impl;

import com.sentinel.api.monitor.dto.KafkaStreamDefinition;
import com.sentinel.api.monitor.dto.MetricSeries;
import com.sentinel.api.monitor.dto.ProcessorKafkaStreamMetricsResponse;
import com.sentinel.api.monitor.prometheus.PrometheusServiceClient;
import com.sentinel.api.monitor.service.ProcessorKafkaStreamMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProcessorKafkaStreamMetricServiceImpl implements ProcessorKafkaStreamMetricService {

    private static final String APPLICATION = "sentinel-processor";

    private static final Map<String, KafkaStreamDefinition> STREAMS = Map.ofEntries(Map.entry("endpoint_minute",
        new KafkaStreamDefinition("endpoint_minute", "endpoint_minute_analytics_source", "endpoint_minute_analytics",
            "endpoint_minute_analytics_sink", "endpoint_minute_analytics")), Map.entry("service_minute",
        new KafkaStreamDefinition("service_minute", "service_minute_analytics_source", "service_minute_analytics",
            "service_minute_analytics_sink", "service_minute_analytics")), Map.entry("product_minute",
        new KafkaStreamDefinition("product_minute", "product_minute_analytics_source", "product_minute_analytics",
            "product_minute_analytics_sink", "product_minute_analytics")), Map.entry("tenant_minute",
        new KafkaStreamDefinition("tenant_minute", "tenant_minute_analytics_source", "tenant_minute_analytics",
            "tenant_minute_analytics_sink", "tenant_minute_analytics")), Map.entry("endpoint_hour",
        new KafkaStreamDefinition("endpoint_hour", "endpoint_hour_analytics_source", "endpoint_hour_analytics",
            "endpoint_hour_analytics_sink", "endpoint_hour_analytics")), Map.entry("service_hour",
        new KafkaStreamDefinition("service_hour", "service_hour_analytics_source", "service_hour_analytics", "service_hour_analytics_sink",
            "service_hour_analytics")), Map.entry("product_hour",
        new KafkaStreamDefinition("product_hour", "product_hour_analytics_source", "product_hour_analytics", "product_hour_analytics_sink",
            "product_hour_analytics")), Map.entry("tenant_hour",
        new KafkaStreamDefinition("tenant_hour", "tenant_hour_analytics_source", "tenant_hour_analytics", "tenant_hour_analytics_sink",
            "tenant_hour_analytics")), Map.entry("endpoint_day",
        new KafkaStreamDefinition("endpoint_day", "endpoint_day_analytics_source", "endpoint_day_analytics", "endpoint_day_analytics_sink",
            "endpoint_day_analytics")), Map.entry("service_day",
        new KafkaStreamDefinition("service_day", "service_day_analytics_source", "service_day_analytics", "service_day_analytics_sink",
            "service_day_analytics")), Map.entry("product_day",
        new KafkaStreamDefinition("product_day", "product_day_analytics_source", "product_day_analytics", "product_day_analytics_sink",
            "product_day_analytics")), Map.entry("tenant_day",
        new KafkaStreamDefinition("tenant_day", "tenant_day_analytics_source", "tenant_day_analytics", "tenant_day_analytics_sink",
            "tenant_day_analytics")));

    private final PrometheusServiceClient prometheusServiceClient;

    @Override
    public ProcessorKafkaStreamMetricsResponse getKafkaStreamMetrics(String stream, Instant from, Instant to) {
        KafkaStreamDefinition definition = STREAMS.get(stream);
        if (definition == null) {
            throw new IllegalArgumentException("Unknown Kafka stream: " + stream);
        }
        int stepSeconds = calculateStepSeconds(from, to);
        MetricSeries consumed = getConsumed(definition, from, to, stepSeconds);
        MetricSeries produced = getProduced(definition, from, to, stepSeconds);
        MetricSeries pollRate = getPollRate(from, to, stepSeconds);
        MetricSeries failedThreads = getFailedStreamThreads(from, to, stepSeconds);
        return new ProcessorKafkaStreamMetricsResponse(stream, consumed, produced, pollRate, failedThreads);
    }

    private MetricSeries getConsumed(KafkaStreamDefinition definition, Instant from, Instant to, int stepSeconds) {
        String query = """
            rate(
                kafka_stream_topic_records_consumed_total{
                    application="%s",
                    processor_node_id="%s",
                    topic="%s"
                }[1m]
            )
            """.formatted(APPLICATION, definition.sourceNode(), definition.sourceTopic());
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "consumedPerSecond");
    }

    private MetricSeries getProduced(KafkaStreamDefinition definition, Instant from, Instant to, int stepSeconds) {
        String query = """
            rate(
                kafka_stream_topic_records_produced_total{
                    application="%s",
                    processor_node_id="%s",
                    topic="%s"
                }[1m]
            )
            """.formatted(APPLICATION, definition.sinkNode(), definition.sinkTopic());
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "producedPerSecond");
    }

    private MetricSeries getPollRate(Instant from, Instant to, int stepSeconds) {
        String query = """
            kafka_stream_thread_poll_rate{
                application="%s"
            }
            """.formatted(APPLICATION);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "pollRatePerSecond");
    }

    private MetricSeries getFailedStreamThreads(Instant from, Instant to, int stepSeconds) {
        String query = """
            kafka_stream_failed_stream_threads_total{
                application="%s"
            }
            """.formatted(APPLICATION);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "failedStreamThreads");
    }

    private MetricSeries toNamedSeries(List<MetricSeries> series, String name) {
        if (series == null || series.isEmpty()) {
            return MetricSeries.empty(name);
        }
        return new MetricSeries(name, series.getFirst().data());
    }

    private int calculateStepSeconds(Instant from, Instant to) {
        long seconds = Duration.between(from, to).getSeconds();
        if (seconds <= 0) {
            throw new IllegalArgumentException("'from' must be before 'to'");
        }
        int maxPoints = 1000;
        return Math.max(1, (int) Math.ceil((double) seconds / maxPoints));
    }
}
