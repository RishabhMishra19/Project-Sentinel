package com.sentinel.api.monitor.service.impl;

import com.sentinel.api.monitor.dto.IngestApplicationMetricsResponse;
import com.sentinel.api.monitor.dto.IngestKafkaMetricsResponse;
import com.sentinel.api.monitor.dto.MetricSeries;
import com.sentinel.api.monitor.prometheus.PrometheusServiceClient;
import com.sentinel.api.monitor.service.IngestMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IngestMetricServiceImpl implements IngestMetricService {
    private static final String INGEST_URI = "/v1/ingest";

    private final PrometheusServiceClient prometheusServiceClient;

    @Override
    public IngestApplicationMetricsResponse getIngestApplicationMetrics(Instant from, Instant to) {
        MetricSeries requests = getHttpRequests(from, to);
        MetricSeries failures = getHttpFailures(from, to);
        MetricSeries latencyP95 = getHttpLatencyP95(from, to);
        return new IngestApplicationMetricsResponse(requests, failures, latencyP95);
    }

    @Override
    public IngestKafkaMetricsResponse getIngestKafkaMetrics(String topic, Instant from, Instant to) {
        MetricSeries kafkaPublished = getKafkaPublished(from, to);
        MetricSeries kafkaPublishFailures = getKafkaPublishFailures(from, to);
        MetricSeries kafkaPublishLatencyP95 = getKafkaPublishLatencyP95(from, to);
        return new IngestKafkaMetricsResponse(kafkaPublished, kafkaPublishFailures, kafkaPublishLatencyP95);
    }

    private MetricSeries getKafkaPublished(Instant from, Instant to) {
        String query = """
            rate(
                sentinel_ingest_kafka_published_total[30s]
            )
            """;
        List<MetricSeries> series = prometheusServiceClient.queryRange(query, from, to, calculateStepSeconds(from, to));
        if (series.isEmpty()) {
            return MetricSeries.empty("kafkaPublished");
        }
        return new MetricSeries("kafkaPublished", series.getFirst().data());
    }

    private MetricSeries getKafkaPublishFailures(Instant from, Instant to) {
        String query = """
            rate(
                sentinel_ingest_kafka_publish_failures_total[30s]
            )
            """;
        List<MetricSeries> series = prometheusServiceClient.queryRange(query, from, to, calculateStepSeconds(from, to));
        if (series.isEmpty()) {
            return MetricSeries.empty("kafkaPublishFailures");
        }
        return new MetricSeries("kafkaPublishFailures", series.getFirst().data());
    }

    private MetricSeries getKafkaPublishLatencyP95(Instant from, Instant to) {
        String query = """
            histogram_quantile(
                0.95,
                sum by (le) (
                    rate(
                        sentinel_ingest_kafka_publish_duration_seconds_bucket[30s]
                    )
                )
            )
            """;
        List<MetricSeries> series = prometheusServiceClient.queryRange(query, from, to, calculateStepSeconds(from, to));
        if (series.isEmpty()) {
            return MetricSeries.empty("kafkaPublishLatencyP95");
        }
        return new MetricSeries("kafkaPublishLatencyP95", series.getFirst().data());
    }

    private MetricSeries getHttpRequests(Instant from, Instant to) {
        String query = """
            rate(
                http_server_requests_seconds_count{
                    method="POST",
                    uri="%s"
                }[30s]
            )
            """.formatted(INGEST_URI);
        List<MetricSeries> series = prometheusServiceClient.queryRange(query, from, to, calculateStepSeconds(from, to));
        if (series.isEmpty()) {
            return MetricSeries.empty("httpRequests");
        }
        return new MetricSeries("httpRequests", series.getFirst().data());
    }

    private MetricSeries getHttpFailures(Instant from, Instant to) {
        String query = """
            rate(
                http_server_requests_seconds_count{
                    method="POST",
                    uri="%s",
                    status=~"4..|5.."
                }[30s]
            )
            """.formatted(INGEST_URI);
        List<MetricSeries> series = prometheusServiceClient.queryRange(query, from, to, calculateStepSeconds(from, to));
        if (series.isEmpty()) {
            return MetricSeries.empty("httpFailures");
        }
        return new MetricSeries("httpFailures", series.getFirst().data());
    }

    private MetricSeries getHttpLatencyP95(Instant from, Instant to) {
        String query = """
            histogram_quantile(
                0.95,
                sum by (le) (
                    rate(
                        http_server_requests_seconds_bucket{
                            method="POST",
                            uri="%s"
                        }[30s]
                    )
                )
            )
            """.formatted(INGEST_URI);
        List<MetricSeries> series = prometheusServiceClient.queryRange(query, from, to, calculateStepSeconds(from, to));
        if (series.isEmpty()) {
            return MetricSeries.empty("httpLatencyP95");
        }
        return new MetricSeries("httpLatencyP95", series.getFirst().data());
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
