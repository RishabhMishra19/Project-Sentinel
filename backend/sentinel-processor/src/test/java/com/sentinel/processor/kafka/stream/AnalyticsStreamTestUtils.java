package com.sentinel.processor.kafka.stream;

import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.kafka.KafkaMessage;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.TestInputTopic;
import org.apache.kafka.streams.TestOutputTopic;
import org.apache.kafka.streams.TopologyTestDriver;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import static org.assertj.core.api.Assertions.assertThat;

public final class AnalyticsStreamTestUtils {

    private AnalyticsStreamTestUtils() {
    }

    // ========================================================================
    // RANDOM DATA
    // ========================================================================

    public static KafkaMessage.ReqLog randomReqLog(
        UUID tenantId,
        UUID productId,
        UUID serviceId,
        UUID endpointId,
        Instant timestamp
    ) {
        return KafkaMessage.ReqLog.builder()
            .requestLogId(UUID.randomUUID())
            .tenantId(tenantId)
            .productId(productId)
            .serviceId(serviceId)
            .endpointId(endpointId)
            .path("/test")
            .occurredAt(timestamp)
            .statusCode(randomStatusCode())
            .durationMs(randomInt(1, 2000))
            .requestSizeBytes(randomInt(100, 5000))
            .responseSizeBytes(randomInt(100, 10000))
            .endUserIp("127.0.0.1")
            .requestId(UUID.randomUUID().toString())
            .traceId(UUID.randomUUID().toString())
            .userId(UUID.randomUUID().toString())
            .build();
    }

    public static KafkaMessage.AnalyticsMetrics randomAnalyticsMetric(
        AnalyticsBucket bucket,
        AnalyticsScope scope,
        UUID entityId,
        Instant timestamp
    ) {
        return randomAnalyticsMetric(
            bucket,
            scope,
            entityId,
            timestamp,
            randomStatusCode(),
            randomInt(1, 2000),
            randomInt(100, 5000),
            randomInt(100, 10000)
        );
    }

    public static KafkaMessage.AnalyticsMetrics randomAnalyticsMetric(
        AnalyticsBucket bucket,
        AnalyticsScope scope,
        UUID entityId,
        Instant timestamp,
        int statusCode,
        long latency,
        long requestBytes,
        long responseBytes
    ) {
        KafkaMessage.AnalyticsMetrics metric =
            new KafkaMessage.AnalyticsMetrics(
                bucket,
                scope,
                entityId
            );

        metric.setTimestamp(timestamp);
        metric.setRequestCount(1);

        metric.setErrorCount(statusCode >= 400 ? 1 : 0);
        metric.setStatus2xx(statusCode >= 200 && statusCode < 300 ? 1 : 0);
        metric.setStatus3xx(statusCode >= 300 && statusCode < 400 ? 1 : 0);
        metric.setStatus4xx(statusCode >= 400 && statusCode < 500 ? 1 : 0);
        metric.setStatus5xx(statusCode >= 500 && statusCode < 600 ? 1 : 0);

        metric.setLatencySumMs(latency);
        metric.setLatencyMinMs(latency);
        metric.setLatencyMaxMs(latency);

        metric.setRequestBytesTotal(requestBytes);
        metric.setResponseBytesTotal(responseBytes);

        metric.getLatencyHistogram().recordValue(latency);

        return metric;
    }

    public static int randomStatusCode() {
        int[] statusCodes = {
            200, 201, 204,
            301, 302,
            400, 404, 409,
            500, 502
        };

        return statusCodes[
            ThreadLocalRandom.current().nextInt(statusCodes.length)
            ];
    }

    public static int randomInt(int min, int max) {
        return ThreadLocalRandom.current()
            .nextInt(min, max + 1);
    }

    // ========================================================================
    // TEST DATA
    // ========================================================================

    public static TestData createTestData(Instant firstTimestamp) {
        return new TestData(
            UUID.randomUUID(),
            UUID.randomUUID(),
            UUID.randomUUID(),
            UUID.randomUUID(),
            firstTimestamp
        );
    }

    // ========================================================================
    // KEYS
    // ========================================================================

    public static String endpointKey(TestData data) {
        return data.tenantId() + "|"
            + data.productId() + "|"
            + data.serviceId() + "|"
            + data.endpointId();
    }

    public static String serviceKey(TestData data) {
        return data.tenantId() + "|"
            + data.productId() + "|"
            + data.serviceId();
    }

    public static String productKey(TestData data) {
        return data.tenantId() + "|"
            + data.productId();
    }

    public static String tenantKey(TestData data) {
        return data.tenantId().toString();
    }

    // ========================================================================
    // INPUT TOPICS
    // ========================================================================

    public static TestInputTopic<String, KafkaMessage.AnalyticsMetrics>
    createAnalyticsInputTopic(
        TopologyTestDriver driver,
        AnalyticsStreamUtils utils,
        String topic
    ) {
        return driver.createInputTopic(
            topic,
            Serdes.String().serializer(),
            utils.analyticsMetricSerde.serializer()
        );
    }

    public static TestInputTopic<String, KafkaMessage.ReqLog>
    createRequestInputTopic(
        TopologyTestDriver driver,
        AnalyticsStreamUtils utils,
        String topic
    ) {
        return driver.createInputTopic(
            topic,
            Serdes.String().serializer(),
            utils.requestLogSerde.serializer()
        );
    }

    // ========================================================================
    // OUTPUT TOPICS
    // ========================================================================

    public static TestOutputTopic<String, KafkaMessage.AnalyticsMetrics>
    createAnalyticsOutputTopic(
        TopologyTestDriver driver,
        AnalyticsStreamUtils utils,
        String topic
    ) {
        return driver.createOutputTopic(
            topic,
            Serdes.String().deserializer(),
            utils.analyticsMetricSerde.deserializer()
        );
    }

    // ========================================================================
    // PIPE INPUT
    // ========================================================================

    public static void pipeRequest(
        TestInputTopic<String, KafkaMessage.ReqLog> input,
        KafkaMessage.ReqLog request
    ) {
        input.pipeInput(
            UUID.randomUUID().toString(),
            request,
            request.occurredAt()
        );
    }

    public static void pipeAnalyticsMetric(
        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input,
        String key,
        KafkaMessage.AnalyticsMetrics metric
    ) {
        input.pipeInput(
            key,
            metric,
            metric.getTimestamp()
        );
    }

    public static void pipeAnalyticsMetrics(
        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input,
        String key,
        List<KafkaMessage.AnalyticsMetrics> metrics
    ) {
        metrics.forEach(metric ->
            pipeAnalyticsMetric(input, key, metric)
        );
    }

    public static void pipeRequests(
        TestInputTopic<String, KafkaMessage.ReqLog> input,
        List<KafkaMessage.ReqLog> requests
    ) {
        requests.forEach(request ->
            pipeRequest(input, request)
        );
    }

    // ========================================================================
    // GENERATE 5 METRICS IN 2 WINDOWS
    // ========================================================================

    /**
     * Generates five input metrics distributed across two aggregation windows.
     * <p>
     * inputBucket  = bucket of the records being fed into the topology. windowBucket = bucket of the aggregation being tested.
     * <p>
     * Example: endpoint minute -> endpoint hour: inputBucket = MINUTE, windowBucket = HOUR
     */
    public static List<KafkaMessage.AnalyticsMetrics> randomFiveMetrics(
        AnalyticsBucket inputBucket,
        AnalyticsBucket windowBucket,
        AnalyticsScope scope,
        UUID entityId,
        Instant base
    ) {
        long windowSize = windowSizeMillis(windowBucket);

        return List.of(
            randomAnalyticsMetric(
                inputBucket, scope, entityId,
                base.plusMillis(5_000L)
            ),
            randomAnalyticsMetric(
                inputBucket, scope, entityId,
                base.plusMillis(windowSize / 3)
            ),
            randomAnalyticsMetric(
                inputBucket, scope, entityId,
                base.plusMillis((windowSize * 3) / 4)
            ),
            randomAnalyticsMetric(
                inputBucket, scope, entityId,
                base.plusMillis(windowSize + 5_000L)
            ),
            randomAnalyticsMetric(
                inputBucket, scope, entityId,
                base.plusMillis(windowSize + windowSize / 3)
            )
        );
    }

    public static long windowSizeMillis(AnalyticsBucket bucket) {
        return switch (bucket) {
            case MINUTE -> 60_000L;
            case HOUR -> 60 * 60_000L;
            case DAY -> 24 * 60 * 60_000L;
        };
    }

    // ========================================================================
    // WINDOW UTILITIES
    // ========================================================================

    public static Instant truncateTimestamp(
        Instant timestamp,
        AnalyticsBucket bucket
    ) {
        return switch (bucket) {
            case MINUTE -> timestamp.truncatedTo(ChronoUnit.MINUTES);

            case HOUR -> timestamp.truncatedTo(ChronoUnit.HOURS);

            case DAY -> timestamp.truncatedTo(ChronoUnit.DAYS);
        };
    }

    /**
     * Timestamp safely beyond the first window + grace period.
     */
    public static Instant closeFirstWindow(
        AnalyticsBucket bucket,
        Instant firstWindow
    ) {
        Instant start =
            truncateTimestamp(firstWindow, bucket);

        return switch (bucket) {
            case MINUTE -> start.plusMillis(3 * 60_000L);

            case HOUR -> start.plusMillis(
                60 * 60_000L
                    + 2 * 60_000L
            );

            case DAY -> start.plusMillis(
                24 * 60 * 60_000L
                    + 2 * 60_000L
            );
        };
    }

    /**
     * Timestamp safely beyond the second window + grace period.
     */
    public static Instant closeSecondWindow(
        AnalyticsBucket bucket,
        Instant firstWindow
    ) {
        Instant start =
            truncateTimestamp(firstWindow, bucket);

        return switch (bucket) {
            case MINUTE -> start.plusMillis(4 * 60_000L);

            case HOUR -> start.plusMillis(
                2 * 60 * 60_000L
                    + 2 * 60_000L
            );

            case DAY -> start.plusMillis(
                2 * 24 * 60 * 60_000L
                    + 2 * 60_000L
            );
        };
    }

    public static Instant secondWindow(
        AnalyticsBucket bucket,
        Instant firstWindow
    ) {
        Instant start =
            truncateTimestamp(firstWindow, bucket);

        return switch (bucket) {
            case MINUTE -> start.plusSeconds(60);

            case HOUR -> start.plusSeconds(60 * 60);

            case DAY -> start.plusSeconds(24 * 60 * 60);
        };
    }

    // ========================================================================
    // FIND OUTPUT
    // ========================================================================

    public static KafkaMessage.AnalyticsMetrics findFirstResultForTimestamp(
        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results,
        Instant expectedTimestamp,
        AnalyticsBucket bucket
    ) {
        Instant expectedWindowTimestamp =
            truncateTimestamp(
                expectedTimestamp,
                bucket
            );

        return results.stream()
            .filter(record ->
                record != null
                    && record.value != null
            )
            .filter(record ->
                expectedWindowTimestamp.equals(
                    record.value.getTimestamp()
                )
            )
            .map(record -> record.value)
            .findFirst()
            .orElse(null);
    }

    public static List<KafkaMessage.AnalyticsMetrics> findResultsForWindow(
        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results,
        Instant expectedTimestamp,
        AnalyticsBucket bucket
    ) {
        Instant expectedWindowTimestamp =
            truncateTimestamp(
                expectedTimestamp,
                bucket
            );

        return results.stream()
            .filter(record ->
                record != null
                    && record.value != null
            )
            .filter(record ->
                expectedWindowTimestamp.equals(
                    record.value.getTimestamp()
                )
            )
            .map(record -> record.value)
            .toList();
    }

    // ========================================================================
    // EXPECTED AGGREGATION
    // ========================================================================

    public static KafkaMessage.AnalyticsMetrics expectedAggregation(
        List<KafkaMessage.AnalyticsMetrics> metrics,
        AnalyticsBucket bucket,
        AnalyticsScope scope,
        UUID entityId
    ) {
        assertThat(metrics)
            .isNotEmpty();

        KafkaMessage.AnalyticsMetrics expected =
            new KafkaMessage.AnalyticsMetrics(
                bucket,
                scope,
                entityId
            );

        expected.setTimestamp(
            truncateTimestamp(
                metrics.getFirst().getTimestamp(),
                bucket
            )
        );

        for (KafkaMessage.AnalyticsMetrics metric : metrics) {
            expected.aggregate(metric);
        }

        expected.setScope(scope);
        expected.setEntityId(entityId);
        expected.setBucket(bucket);

        return expected;
    }

    // ========================================================================
    // ASSERT AGGREGATION
    // ========================================================================

    public static void assertAggregation(
        KafkaMessage.AnalyticsMetrics actual,
        List<KafkaMessage.AnalyticsMetrics> inputMetrics,
        AnalyticsBucket bucket,
        AnalyticsScope scope,
        UUID entityId
    ) {
        KafkaMessage.AnalyticsMetrics expected =
            expectedAggregation(
                inputMetrics,
                bucket,
                scope,
                entityId
            );

        assertThat(actual)
            .isNotNull();

        assertThat(actual.getBucket())
            .isEqualTo(expected.getBucket());

        assertThat(actual.getScope())
            .isEqualTo(expected.getScope());

        assertThat(actual.getEntityId())
            .isEqualTo(expected.getEntityId());

        assertThat(actual.getTimestamp())
            .isEqualTo(expected.getTimestamp());

        assertThat(actual.getRequestCount())
            .isEqualTo(expected.getRequestCount());

        assertThat(actual.getErrorCount())
            .isEqualTo(expected.getErrorCount());

        assertThat(actual.getStatus2xx())
            .isEqualTo(expected.getStatus2xx());

        assertThat(actual.getStatus3xx())
            .isEqualTo(expected.getStatus3xx());

        assertThat(actual.getStatus4xx())
            .isEqualTo(expected.getStatus4xx());

        assertThat(actual.getStatus5xx())
            .isEqualTo(expected.getStatus5xx());

        assertThat(actual.getLatencySumMs())
            .isEqualTo(expected.getLatencySumMs());

        assertThat(actual.getLatencyMinMs())
            .isEqualTo(expected.getLatencyMinMs());

        assertThat(actual.getLatencyMaxMs())
            .isEqualTo(expected.getLatencyMaxMs());

        assertThat(actual.getRequestBytesTotal())
            .isEqualTo(expected.getRequestBytesTotal());

        assertThat(actual.getResponseBytesTotal())
            .isEqualTo(expected.getResponseBytesTotal());

        assertThat(actual.getLatencyHistogram())
            .isNotNull();

        assertThat(actual.getLatencyHistogram().getTotalCount())
            .isEqualTo(
                expected.getLatencyHistogram()
                    .getTotalCount()
            );
    }

    // ========================================================================
    // TEST DATA
    // ========================================================================

    public record TestData(
        UUID tenantId,
        UUID productId,
        UUID serviceId,
        UUID endpointId,
        Instant firstTimestamp
    ) {
    }
}
