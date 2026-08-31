package com.sentinel.api.monitor.service.impl;

import com.sentinel.api.monitor.dto.MetricSeries;
import com.sentinel.api.monitor.dto.ProcessorCassandraTableMetrics;
import com.sentinel.api.monitor.dto.ProcessorKafkaListenerMetrics;
import com.sentinel.api.monitor.prometheus.PrometheusServiceClient;
import com.sentinel.api.monitor.service.ProcessorMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessorMetricServiceImpl implements ProcessorMetricService {

    private final PrometheusServiceClient prometheusServiceClient;

    @Override
    public ProcessorKafkaListenerMetrics getListenerMetrics(String topic, Instant from, Instant to) {
        int stepSeconds = calculateStepSeconds(from, to);
        MetricSeries polled = getPolled(topic, from, to, stepSeconds);
        MetricSeries failures = getFailures(topic, from, to, stepSeconds);
        MetricSeries processingLatencyP95 = getProcessingLatencyP95(topic, from, to, stepSeconds);
        return new ProcessorKafkaListenerMetrics(polled, failures, processingLatencyP95);
    }

    @Override
    public ProcessorCassandraTableMetrics getCassandraMetrics(String table, Instant from, Instant to) {
        int stepSeconds = calculateStepSeconds(from, to);
        MetricSeries writes = getCassandraWrites(table, from, to, stepSeconds);
        MetricSeries failures = getCassandraFailures(table, from, to, stepSeconds);
        MetricSeries latencySeries = getCassandraLatency(table, from, to, stepSeconds);
        return new ProcessorCassandraTableMetrics(writes, failures, latencySeries);
    }

    private MetricSeries getPolled(String topic, Instant from, Instant to, int stepSeconds) {
        String query = """
            rate(
                sentinel_processor_records_polled_total{
                    topic="%s"
                }[30s]
            )
            """.formatted(topic);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "polled");
    }

    private MetricSeries getFailures(String topic, Instant from, Instant to, int stepSeconds) {
        String query = """
            rate(
                sentinel_processor_records_failed_total{
                    topic="%s"
                }[30s]
            )
            """.formatted(topic);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "failures");
    }

    private MetricSeries getProcessingLatencyP95(String topic, Instant from, Instant to, int stepSeconds) {
        String query = """
            histogram_quantile(
                0.95,
                sum by (le) (
                    rate(
                        sentinel_processor_record_processing_duration_seconds_bucket{
                            topic="%s"
                        }[5m]
                    )
                )
            )
            """.formatted(topic);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "batchProcessingLatencyP95");
    }

    private MetricSeries getCassandraWrites(String table, Instant from, Instant to, int stepSeconds) {
        String query = """
            rate(
                sentinel_processor_cassandra_writes_total{
                    table="%s"
                }[30s]
            )
            """.formatted(table);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "writes");
    }

    private MetricSeries getCassandraFailures(String table, Instant from, Instant to, int stepSeconds) {
        String query = """
            rate(
                sentinel_processor_cassandra_write_failures_total{
                    table="%s"
                }[30s]
            )
            """.formatted(table);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "failures");
    }

    private MetricSeries getCassandraLatency(String table, Instant from, Instant to, int stepSeconds) {
        String query = """
            histogram_quantile(
                0.95,
                sum by (le) (
                    rate(
                        sentinel_processor_cassandra_write_duration_seconds_bucket{
                            table="%s"
                        }[5m]
                    )
                )
            )
            """.formatted(table);
        return toNamedSeries(prometheusServiceClient.queryRange(query, from, to, stepSeconds), "latencyP95");
    }

    private int calculateStepSeconds(Instant from, Instant to) {
        long seconds = Duration.between(from, to).getSeconds();
        if (seconds <= 0) {
            throw new IllegalArgumentException("'from' must be before 'to'");
        }
        int maxPoints = 1000;
        return Math.max(1, (int) Math.ceil((double) seconds / maxPoints));
    }

    private MetricSeries toNamedSeries(List<MetricSeries> series, String name) {
        if (series == null || series.isEmpty()) {
            return MetricSeries.empty(name);
        }
        return new MetricSeries(name, series.getFirst().data());
    }
}
