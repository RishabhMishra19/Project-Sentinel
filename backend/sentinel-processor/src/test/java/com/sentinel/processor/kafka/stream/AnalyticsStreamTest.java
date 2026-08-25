package com.sentinel.processor.kafka.stream;

import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import org.apache.kafka.streams.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class AnalyticsStreamTest {

    private static final long MINUTE_MS = 60_000L;
    private static final long HOUR_MS = 60 * MINUTE_MS;
    private static final long DAY_MS = 24 * HOUR_MS;

    private static final Instant BASE =
            Instant.parse("2026-08-25T10:00:00Z");

    @Autowired
    private AnalyticsStream analyticsStream;

    @Autowired
    private AnalyticsStreamUtils analyticsStreamUtils;

    private TopologyTestDriver testDriver;

    @BeforeEach
    void setUp() {

        StreamsBuilder builder = new StreamsBuilder();

        /*
         * Build the actual production topology.
         */
        analyticsStream.buildTopology(builder);

        Topology topology = builder.build();

        Properties properties = new Properties();

        properties.put(
                StreamsConfig.APPLICATION_ID_CONFIG,
                "sentinel-analytics-test"
        );

        properties.put(
                StreamsConfig.BOOTSTRAP_SERVERS_CONFIG,
                "dummy:9092"
        );

        testDriver = new TopologyTestDriver(
                topology,
                properties
        );
    }

    @AfterEach
    void tearDown() {
        if (testDriver != null) {
            testDriver.close();
        }
    }

    // ========================================================================
    // 1. REQUEST LOG -> ENDPOINT MINUTE
    // ========================================================================

    @Test
    void shouldAggregateRequestLogsIntoEndpointMinute() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.ReqLog> input =
                AnalyticsStreamTestUtils.createRequestInputTopic(
                        testDriver,
                        analyticsStreamUtils,
                        KafkaTopics.request_logs
                );

        List<KafkaMessage.ReqLog> requests = List.of(
                AnalyticsStreamTestUtils.randomReqLog(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        data.endpointId(),
                        BASE.plusMillis(10_000L)
                ),
                AnalyticsStreamTestUtils.randomReqLog(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        data.endpointId(),
                        BASE.plusMillis(20_000L)
                ),
                AnalyticsStreamTestUtils.randomReqLog(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        data.endpointId(),
                        BASE.plusMillis(40_000L)
                ),
                AnalyticsStreamTestUtils.randomReqLog(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        data.endpointId(),
                        BASE.plusMillis(MINUTE_MS + 10_000L)
                ),
                AnalyticsStreamTestUtils.randomReqLog(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        data.endpointId(),
                        BASE.plusMillis(MINUTE_MS + 30_000L)
                )
        );

        AnalyticsStreamTestUtils.pipeRequests(
                input,
                requests
        );

        /*
         * First minute:
         *
         * 10:00:00 -> 10:01:00
         *
         * Grace:
         *
         * 10:01:00 -> 10:02:00
         *
         * Move stream time beyond grace.
         */
        Instant closingTimestamp =
                BASE.plusMillis(3 * MINUTE_MS);

        input.pipeInput(
                UUID.randomUUID().toString(),
                AnalyticsStreamTestUtils.randomReqLog(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        UUID.randomUUID(),
                        closingTimestamp
                ),
                closingTimestamp
        );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                AnalyticsStreamTestUtils.createAnalyticsOutputTopic(
                        testDriver,
                        analyticsStreamUtils,
                        KafkaTopics.endpoint_minute_analytics
                );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                output.readKeyValuesToList();

        assertThat(results)
                .hasSize(2);

        List<KafkaMessage.ReqLog> firstWindowRequests =
                requests.stream()
                        .filter(request ->
                                request.occurredAt().isBefore(
                                        BASE.plusMillis(MINUTE_MS)
                                )
                        )
                        .toList();

        List<KafkaMessage.ReqLog> secondWindowRequests =
                requests.stream()
                        .filter(request ->
                                !request.occurredAt().isBefore(
                                        BASE.plusMillis(MINUTE_MS)
                                )
                        )
                        .toList();

        KafkaMessage.AnalyticsMetrics actualFirst =
                AnalyticsStreamTestUtils.findFirstResultForTimestamp(
                        results,
                        BASE,
                        AnalyticsBucket.MINUTE
                );

        KafkaMessage.AnalyticsMetrics actualSecond =
                AnalyticsStreamTestUtils.findFirstResultForTimestamp(
                        results,
                        BASE.plusMillis(MINUTE_MS),
                        AnalyticsBucket.MINUTE
                );

        List<KafkaMessage.AnalyticsMetrics> expectedFirstMetrics =
                firstWindowRequests.stream()
                        .map(request ->
                                new KafkaMessage.AnalyticsMetrics(
                                        AnalyticsBucket.MINUTE,
                                        AnalyticsScope.ENDPOINT,
                                        request.endpointId()
                                ).initialize(request)
                        )
                        .toList();

        List<KafkaMessage.AnalyticsMetrics> expectedSecondMetrics =
                secondWindowRequests.stream()
                        .map(request ->
                                new KafkaMessage.AnalyticsMetrics(
                                        AnalyticsBucket.MINUTE,
                                        AnalyticsScope.ENDPOINT,
                                        request.endpointId()
                                ).initialize(request)
                        )
                        .toList();

        AnalyticsStreamTestUtils.assertAggregation(
                actualFirst,
                expectedFirstMetrics,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.ENDPOINT,
                data.endpointId()
        );

        AnalyticsStreamTestUtils.assertAggregation(
                actualSecond,
                expectedSecondMetrics,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.ENDPOINT,
                data.endpointId()
        );
    }

    // ========================================================================
    // 2. ENDPOINT MINUTE -> SERVICE MINUTE
    // ========================================================================

    @Test
    void shouldAggregateEndpointMinutesIntoServiceMinute() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.endpoint_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.endpointKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.SERVICE,
                        data.serviceId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeMinute(
                input,
                key,
                data.endpointId(),
                AnalyticsScope.ENDPOINT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.service_minute_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.MINUTE,
                data.serviceId(),
                AnalyticsScope.SERVICE
        );
    }

    // ========================================================================
    // 3. SERVICE MINUTE -> PRODUCT MINUTE
    // ========================================================================

    @Test
    void shouldAggregateServiceMinutesIntoProductMinute() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.service_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.serviceKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.PRODUCT,
                        data.productId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeMinute(
                input,
                key,
                data.serviceId(),
                AnalyticsScope.SERVICE
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.product_minute_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.MINUTE,
                data.productId(),
                AnalyticsScope.PRODUCT
        );
    }

    // ========================================================================
    // 4. PRODUCT MINUTE -> TENANT MINUTE
    // ========================================================================

    @Test
    void shouldAggregateProductMinutesIntoTenantMinute() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.product_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.productKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.TENANT,
                        data.tenantId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeMinute(
                input,
                key,
                data.productId(),
                AnalyticsScope.PRODUCT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.tenant_minute_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.MINUTE,
                data.tenantId(),
                AnalyticsScope.TENANT
        );
    }

    // ========================================================================
    // 5. ENDPOINT MINUTE -> ENDPOINT HOUR
    // ========================================================================

    @Test
    void shouldAggregateEndpointMinutesIntoEndpointHour() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.endpoint_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.endpointKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.ENDPOINT,
                        data.endpointId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeHour(
                input,
                key,
                data.endpointId(),
                AnalyticsScope.ENDPOINT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.endpoint_hour_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.HOUR,
                data.endpointId(),
                AnalyticsScope.ENDPOINT
        );
    }

    // ========================================================================
    // 6. SERVICE MINUTE -> SERVICE HOUR
    // ========================================================================

    @Test
    void shouldAggregateServiceMinutesIntoServiceHour() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.service_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.serviceKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.SERVICE,
                        data.serviceId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeHour(
                input,
                key,
                data.serviceId(),
                AnalyticsScope.SERVICE
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.service_hour_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.HOUR,
                data.serviceId(),
                AnalyticsScope.SERVICE
        );
    }

    // ========================================================================
    // 7. PRODUCT MINUTE -> PRODUCT HOUR
    // ========================================================================

    @Test
    void shouldAggregateProductMinutesIntoProductHour() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.product_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.productKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.PRODUCT,
                        data.productId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeHour(
                input,
                key,
                data.productId(),
                AnalyticsScope.PRODUCT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.product_hour_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.HOUR,
                data.productId(),
                AnalyticsScope.PRODUCT
        );
    }

    // ========================================================================
    // 8. TENANT MINUTE -> TENANT HOUR
    // ========================================================================

    @Test
    void shouldAggregateTenantMinutesIntoTenantHour() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.tenant_minute_analytics
                );

        String key =
                AnalyticsStreamTestUtils.tenantKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.MINUTE,
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.TENANT,
                        data.tenantId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeHour(
                input,
                key,
                data.tenantId(),
                AnalyticsScope.TENANT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.tenant_hour_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.HOUR,
                data.tenantId(),
                AnalyticsScope.TENANT
        );
    }

    // ========================================================================
    // 9. ENDPOINT HOUR -> ENDPOINT DAY
    // ========================================================================

    @Test
    void shouldAggregateEndpointHoursIntoEndpointDay() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.endpoint_hour_analytics
                );

        String key =
                AnalyticsStreamTestUtils.endpointKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.HOUR,
                        AnalyticsBucket.DAY,
                        AnalyticsScope.ENDPOINT,
                        data.endpointId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeDay(
                input,
                key,
                data.endpointId(),
                AnalyticsScope.ENDPOINT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.endpoint_day_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.DAY,
                data.endpointId(),
                AnalyticsScope.ENDPOINT
        );
    }

    // ========================================================================
    // 10. SERVICE HOUR -> SERVICE DAY
    // ========================================================================

    @Test
    void shouldAggregateServiceHoursIntoServiceDay() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.service_hour_analytics
                );

        String key =
                AnalyticsStreamTestUtils.serviceKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.HOUR,
                        AnalyticsBucket.DAY,
                        AnalyticsScope.SERVICE,
                        data.serviceId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeDay(
                input,
                key,
                data.serviceId(),
                AnalyticsScope.SERVICE
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.service_day_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.DAY,
                data.serviceId(),
                AnalyticsScope.SERVICE
        );
    }

    // ========================================================================
    // 11. PRODUCT HOUR -> PRODUCT DAY
    // ========================================================================

    @Test
    void shouldAggregateProductHoursIntoProductDay() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.product_hour_analytics
                );

        String key =
                AnalyticsStreamTestUtils.productKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.HOUR,
                        AnalyticsBucket.DAY,
                        AnalyticsScope.PRODUCT,
                        data.productId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeDay(
                input,
                key,
                data.productId(),
                AnalyticsScope.PRODUCT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.product_day_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.DAY,
                data.productId(),
                AnalyticsScope.PRODUCT
        );
    }

    // ========================================================================
    // 12. TENANT HOUR -> TENANT DAY
    // ========================================================================

    @Test
    void shouldAggregateTenantHoursIntoTenantDay() {

        AnalyticsStreamTestUtils.TestData data =
                AnalyticsStreamTestUtils.createTestData(BASE);

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                analyticsInput(
                        KafkaTopics.tenant_hour_analytics
                );

        String key =
                AnalyticsStreamTestUtils.tenantKey(data);

        List<KafkaMessage.AnalyticsMetrics> metrics =
                AnalyticsStreamTestUtils.randomFiveMetrics(
                        AnalyticsBucket.HOUR,
                        AnalyticsBucket.DAY,
                        AnalyticsScope.TENANT,
                        data.tenantId(),
                        BASE
                );

        AnalyticsStreamTestUtils.pipeAnalyticsMetrics(
                input,
                key,
                metrics
        );

        closeDay(
                input,
                key,
                data.tenantId(),
                AnalyticsScope.TENANT
        );

        List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results =
                analyticsOutput(
                        KafkaTopics.tenant_day_analytics
                ).readKeyValuesToList();

        assertThat(results).hasSize(2);

        assertDownstreamWindowResults(
                results,
                metrics,
                AnalyticsBucket.DAY,
                data.tenantId(),
                AnalyticsScope.TENANT
        );
    }

    // ========================================================================
    // INPUT / OUTPUT HELPERS
    // ========================================================================

    private TestInputTopic<String, KafkaMessage.AnalyticsMetrics>
    analyticsInput(String topic) {

        return AnalyticsStreamTestUtils.createAnalyticsInputTopic(
                testDriver,
                analyticsStreamUtils,
                topic
        );
    }

    private TestOutputTopic<String, KafkaMessage.AnalyticsMetrics>
    analyticsOutput(String topic) {

        return AnalyticsStreamTestUtils.createAnalyticsOutputTopic(
                testDriver,
                analyticsStreamUtils,
                topic
        );
    }

    // ========================================================================
    // WINDOW CLOSING
    // ========================================================================

    private void closeMinute(
            TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input,
            String key,
            UUID entityId,
            AnalyticsScope scope
    ) {

        Instant timestamp =
                AnalyticsStreamTestUtils.closeSecondWindow(
                        AnalyticsBucket.MINUTE,
                        BASE
                );

        input.pipeInput(
                key,
                AnalyticsStreamTestUtils.randomAnalyticsMetric(
                        AnalyticsBucket.MINUTE,
                        scope,
                        entityId,
                        timestamp
                ),
                timestamp
        );
    }

    private void closeHour(
            TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input,
            String key,
            UUID entityId,
            AnalyticsScope scope
    ) {

        Instant timestamp =
                AnalyticsStreamTestUtils.closeSecondWindow(
                        AnalyticsBucket.HOUR,
                        BASE
                );

        input.pipeInput(
                key,
                AnalyticsStreamTestUtils.randomAnalyticsMetric(
                        AnalyticsBucket.MINUTE,
                        scope,
                        entityId,
                        timestamp
                ),
                timestamp
        );
    }

    private void closeDay(
            TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input,
            String key,
            UUID entityId,
            AnalyticsScope scope
    ) {

        Instant timestamp =
                AnalyticsStreamTestUtils.closeSecondWindow(
                        AnalyticsBucket.DAY,
                        BASE
                );

        input.pipeInput(
                key,
                AnalyticsStreamTestUtils.randomAnalyticsMetric(
                        AnalyticsBucket.HOUR,
                        scope,
                        entityId,
                        timestamp
                ),
                timestamp
        );
    }

    // ========================================================================
    // DOWNSTREAM ASSERTION
    // ========================================================================

    private void assertDownstreamWindowResults(
            List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results,
            List<KafkaMessage.AnalyticsMetrics> inputMetrics,
            AnalyticsBucket outputBucket,
            UUID expectedEntityId,
            AnalyticsScope expectedScope
    ) {

        Instant firstWindow =
                AnalyticsStreamTestUtils.truncateTimestamp(
                        inputMetrics.getFirst().getTimestamp(),
                        outputBucket
                );

        Instant secondWindow =
                AnalyticsStreamTestUtils.secondWindow(
                        outputBucket,
                        firstWindow
                );

        List<KafkaMessage.AnalyticsMetrics> firstWindowMetrics =
                inputMetrics.stream()
                        .filter(metric ->
                                AnalyticsStreamTestUtils
                                        .truncateTimestamp(
                                                metric.getTimestamp(),
                                                outputBucket
                                        )
                                        .equals(firstWindow)
                        )
                        .toList();

        List<KafkaMessage.AnalyticsMetrics> secondWindowMetrics =
                inputMetrics.stream()
                        .filter(metric ->
                                AnalyticsStreamTestUtils
                                        .truncateTimestamp(
                                                metric.getTimestamp(),
                                                outputBucket
                                        )
                                        .equals(secondWindow)
                        )
                        .toList();

        assertThat(firstWindowMetrics)
                .isNotEmpty();

        assertThat(secondWindowMetrics)
                .isNotEmpty();

        KafkaMessage.AnalyticsMetrics actualFirst =
                AnalyticsStreamTestUtils.findFirstResultForTimestamp(
                        results,
                        firstWindow,
                        outputBucket
                );

        KafkaMessage.AnalyticsMetrics actualSecond =
                AnalyticsStreamTestUtils.findFirstResultForTimestamp(
                        results,
                        secondWindow,
                        outputBucket
                );

        AnalyticsStreamTestUtils.assertAggregation(
                actualFirst,
                firstWindowMetrics,
                outputBucket,
                expectedScope,
                expectedEntityId
        );

        AnalyticsStreamTestUtils.assertAggregation(
                actualSecond,
                secondWindowMetrics,
                outputBucket,
                expectedScope,
                expectedEntityId
        );
    }
}