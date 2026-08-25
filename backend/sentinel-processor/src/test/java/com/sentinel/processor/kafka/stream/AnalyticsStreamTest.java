package com.sentinel.processor.kafka.stream;

import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Properties;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class AnalyticsStreamTest {

    @Autowired
    private AnalyticsStream analyticsStream;

    @Autowired
    private AnalyticsStreamUtils analyticsStreamUtils;

    private TopologyTestDriver testDriver;

    // ========================================================================
    // SETUP
    // ========================================================================

    @BeforeEach
    void setUp() {

        StreamsBuilder builder = new StreamsBuilder();

        /*
         * Build the ACTUAL production topology.
         *
         * Nothing from the production topology is duplicated here.
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
    // 1. REQUEST_LOG -> ENDPOINT_MINUTE
    // ========================================================================

    @Test
    @Order(1)
    void shouldProcessRequestLogToEndpointMinute() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.ReqLog> input =
                createRequestLogInputTopic();

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.endpoint_minute_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:10Z");

        /*
         * Target request.
         *
         * This belongs to:
         *
         * 10:00:00 -> 10:01:00
         */
        pipeRequest(
                input,
                data,
                targetTimestamp,
                data.endpointId(),
                200,
                200,
                1000,
                100
        );

        /*
         * Move endpoint-minute stream time beyond:
         *
         * window end = 10:01:00
         * grace      = 10:02:00
         *
         * 10:02:10 is safely beyond grace.
         */
        Instant futureTimestamp =
                Instant.parse("2026-08-25T10:02:10Z");

        UUID futureEndpoint = UUID.randomUUID();

        pipeRequest(
                input,
                data,
                futureTimestamp,
                futureEndpoint,
                200,
                100,
                100,
                50
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.MINUTE
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.ENDPOINT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.ENDPOINT);
    }

    // ========================================================================
    // 2. ENDPOINT_MINUTE -> SERVICE_MINUTE
    // ========================================================================

    @Test
    @Order(2)
    void shouldProcessEndpointMinuteToServiceMinute() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.endpoint_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.service_minute_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        /*
         * Target endpoint-minute record.
         */
        input.pipeInput(
                endpointKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.ENDPOINT,
                        data.endpointId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        /*
         * Advance SERVICE-MINUTE stream time.
         *
         * The service stream receives endpoint-minute records,
         * so this future record must be injected into the
         * endpoint-minute input topic as well.
         */
        Instant futureTimestamp =
                Instant.parse("2026-08-25T10:04:00Z");

        UUID futureEndpoint = UUID.randomUUID();

        input.pipeInput(
                endpointKey(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        futureEndpoint
                ),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.ENDPOINT,
                        futureEndpoint,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.MINUTE
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.SERVICE,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.SERVICE);
    }

    // ========================================================================
    // 3. SERVICE_MINUTE -> PRODUCT_MINUTE
    // ========================================================================

    @Test
    @Order(3)
    void shouldProcessServiceMinuteToProductMinute() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.service_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.product_minute_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        input.pipeInput(
                serviceKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.SERVICE,
                        data.serviceId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        /*
         * Advance product-minute stream time.
         */
        Instant futureTimestamp =
                Instant.parse("2026-08-25T10:04:00Z");

        UUID futureService = UUID.randomUUID();

        input.pipeInput(
                serviceKey(
                        data.tenantId(),
                        data.productId(),
                        futureService
                ),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.SERVICE,
                        futureService,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.MINUTE
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.PRODUCT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.PRODUCT);
    }

    // ========================================================================
    // 4. PRODUCT_MINUTE -> TENANT_MINUTE
    // ========================================================================

    @Test
    @Order(4)
    void shouldProcessProductMinuteToTenantMinute() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.product_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.tenant_minute_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        input.pipeInput(
                productKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.PRODUCT,
                        data.productId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        /*
         * Advance tenant-minute stream time.
         */
        Instant futureTimestamp =
                Instant.parse("2026-08-25T10:04:00Z");

        UUID futureProduct = UUID.randomUUID();

        input.pipeInput(
                productKey(
                        data.tenantId(),
                        futureProduct
                ),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.PRODUCT,
                        futureProduct,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.MINUTE
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.MINUTE,
                AnalyticsScope.TENANT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.TENANT);
    }

    // ========================================================================
    // 5. ENDPOINT_MINUTE -> ENDPOINT_HOUR
    // ========================================================================

    @Test
    @Order(5)
    void shouldProcessEndpointMinuteToEndpointHour() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.endpoint_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.endpoint_hour_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        input.pipeInput(
                endpointKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.ENDPOINT,
                        data.endpointId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        /*
         * Hour:
         *
         * 10:00 -> 11:00
         * grace  -> 11:01
         *
         * 11:02 is beyond grace.
         */
        Instant futureTimestamp =
                Instant.parse("2026-08-25T11:02:00Z");

        UUID futureEndpoint = UUID.randomUUID();

        input.pipeInput(
                endpointKey(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        futureEndpoint
                ),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.ENDPOINT,
                        futureEndpoint,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.HOUR
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.HOUR,
                AnalyticsScope.ENDPOINT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.ENDPOINT);
    }

    // ========================================================================
    // 6. ENDPOINT_HOUR -> ENDPOINT_DAY
    // ========================================================================

    @Test
    @Order(6)
    void shouldProcessEndpointHourToEndpointDay() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.endpoint_hour_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.endpoint_day_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T00:00:00Z");

        input.pipeInput(
                endpointKey(data),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.ENDPOINT,
                        data.endpointId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        /*
         * Day:
         *
         * 25 Aug 00:00 -> 26 Aug 00:00
         * grace          -> 26 Aug 00:01
         */
        Instant futureTimestamp =
                Instant.parse("2026-08-26T00:02:00Z");

        UUID futureEndpoint = UUID.randomUUID();

        input.pipeInput(
                endpointKey(
                        data.tenantId(),
                        data.productId(),
                        data.serviceId(),
                        futureEndpoint
                ),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.ENDPOINT,
                        futureEndpoint,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.DAY
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.DAY,
                AnalyticsScope.ENDPOINT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.ENDPOINT);
    }

    // ========================================================================
    // 7. SERVICE_MINUTE -> SERVICE_HOUR
    // ========================================================================

    @Test
    @Order(8)
    void shouldProcessServiceMinuteToServiceHour() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.service_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.service_hour_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        input.pipeInput(
                serviceKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.SERVICE,
                        data.serviceId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        Instant futureTimestamp =
                Instant.parse("2026-08-25T11:02:00Z");

        UUID futureService = UUID.randomUUID();

        input.pipeInput(
                serviceKey(
                        data.tenantId(),
                        data.productId(),
                        futureService
                ),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.SERVICE,
                        futureService,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.HOUR
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.HOUR,
                AnalyticsScope.SERVICE,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.SERVICE);
    }

    // ========================================================================
    // 8. SERVICE_HOUR -> SERVICE_DAY
    // ========================================================================

    @Test
    @Order(9)
    void shouldProcessServiceHourToServiceDay() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.service_hour_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.service_day_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T00:00:00Z");

        input.pipeInput(
                serviceKey(data),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.SERVICE,
                        data.serviceId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        Instant futureTimestamp =
                Instant.parse("2026-08-26T00:02:00Z");

        UUID futureService = UUID.randomUUID();

        input.pipeInput(
                serviceKey(
                        data.tenantId(),
                        data.productId(),
                        futureService
                ),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.SERVICE,
                        futureService,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.DAY
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.DAY,
                AnalyticsScope.SERVICE,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.SERVICE);
    }

    // ========================================================================
    // 9. PRODUCT_MINUTE -> PRODUCT_HOUR
    // ========================================================================

    @Test
    @Order(11)
    void shouldProcessProductMinuteToProductHour() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.product_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.product_hour_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        input.pipeInput(
                productKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.PRODUCT,
                        data.productId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        Instant futureTimestamp =
                Instant.parse("2026-08-25T11:02:00Z");

        UUID futureProduct = UUID.randomUUID();

        input.pipeInput(
                productKey(
                        data.tenantId(),
                        futureProduct
                ),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.PRODUCT,
                        futureProduct,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.HOUR
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.HOUR,
                AnalyticsScope.PRODUCT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.PRODUCT);
    }

    // ========================================================================
    // 10. PRODUCT_HOUR -> PRODUCT_DAY
    // ========================================================================

    @Test
    @Order(12)
    void shouldProcessProductHourToProductDay() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.product_hour_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.product_day_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T00:00:00Z");

        input.pipeInput(
                productKey(data),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.PRODUCT,
                        data.productId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        Instant futureTimestamp =
                Instant.parse("2026-08-26T00:02:00Z");

        UUID futureProduct = UUID.randomUUID();

        input.pipeInput(
                productKey(
                        data.tenantId(),
                        futureProduct
                ),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.PRODUCT,
                        futureProduct,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.DAY
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.DAY,
                AnalyticsScope.PRODUCT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.PRODUCT);
    }

    // ========================================================================
    // 11. TENANT_MINUTE -> TENANT_HOUR
    // ========================================================================

    @Test
    @Order(13)
    void shouldProcessTenantMinuteToTenantHour() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.tenant_minute_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.tenant_hour_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T10:00:00Z");

        input.pipeInput(
                tenantKey(data),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.TENANT,
                        data.tenantId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        Instant futureTimestamp =
                Instant.parse("2026-08-25T11:02:00Z");

        UUID futureTenant = UUID.randomUUID();

        input.pipeInput(
                tenantKey(futureTenant),
                createMetric(
                        AnalyticsBucket.MINUTE,
                        AnalyticsScope.TENANT,
                        futureTenant,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.HOUR
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.HOUR,
                AnalyticsScope.TENANT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );

        assertEntityId(result, data, AnalyticsScope.TENANT);
    }

    // ========================================================================
    // 12. TENANT_HOUR -> TENANT_DAY
    // ========================================================================

    @Test
    @Order(14)
    void shouldProcessTenantHourToTenantDay() {

        TestData data = createTestData();

        TestInputTopic<String, KafkaMessage.AnalyticsMetrics> input =
                createAnalyticsInputTopic(
                        KafkaTopics.tenant_hour_analytics
                );

        TestOutputTopic<String, KafkaMessage.AnalyticsMetrics> output =
                createOutputTopic(
                        KafkaTopics.tenant_day_analytics
                );

        Instant targetTimestamp =
                Instant.parse("2026-08-25T00:00:00Z");

        input.pipeInput(
                tenantKey(data),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.TENANT,
                        data.tenantId(),
                        targetTimestamp,
                        200
                ),
                targetTimestamp
        );

        Instant futureTimestamp =
                Instant.parse("2026-08-26T00:02:00Z");

        UUID futureTenant = UUID.randomUUID();

        input.pipeInput(
                tenantKey(futureTenant),
                createMetric(
                        AnalyticsBucket.HOUR,
                        AnalyticsScope.TENANT,
                        futureTenant,
                        futureTimestamp,
                        100
                ),
                futureTimestamp
        );

        KafkaMessage.AnalyticsMetrics result =
                findFirstResultForTimestamp(
                        output.readKeyValuesToList(),
                        targetTimestamp,
                        AnalyticsBucket.DAY
                );

        assertThat(result).isNotNull();

        assertBasicAnalytics(
                result,
                AnalyticsBucket.DAY,
                AnalyticsScope.TENANT,
                1,
                0,
                1,
                0,
                0,
                0,
                200,
                200,
                200,
                1000,
                100
        );
        assertEntityId(result, data, AnalyticsScope.TENANT);
    }

    // ========================================================================
    // INPUT TOPICS
    // ========================================================================

    private TestInputTopic<String, KafkaMessage.ReqLog>
    createRequestLogInputTopic() {

        return testDriver.createInputTopic(
                KafkaTopics.request_logs,
                Serdes.String().serializer(),
                analyticsStreamUtils.requestLogSerde.serializer()
        );
    }

    private TestInputTopic<String, KafkaMessage.AnalyticsMetrics>
    createAnalyticsInputTopic(String topic) {

        return testDriver.createInputTopic(
                topic,
                Serdes.String().serializer(),
                analyticsStreamUtils.analyticsMetricSerde.serializer()
        );
    }

    // ========================================================================
    // OUTPUT TOPICS
    // ========================================================================

    private TestOutputTopic<String, KafkaMessage.AnalyticsMetrics>
    createOutputTopic(String topic) {

        return testDriver.createOutputTopic(
                topic,
                Serdes.String().deserializer(),
                analyticsStreamUtils.analyticsMetricSerde.deserializer()
        );
    }

    // ========================================================================
    // REQUEST CREATION
    // ========================================================================

    private void pipeRequest(
            TestInputTopic<String, KafkaMessage.ReqLog> input,
            TestData data,
            Instant timestamp,
            UUID endpointId,
            int statusCode,
            int durationMs,
            int requestBytes,
            int responseBytes
    ) {

        KafkaMessage.ReqLog request =
                KafkaMessage.ReqLog.builder()
                        .requestLogId(UUID.randomUUID())
                        .tenantId(data.tenantId())
                        .productId(data.productId())
                        .serviceId(data.serviceId())
                        .endpointId(endpointId)
                        .path("/test")
                        .occurredAt(timestamp)
                        .statusCode(statusCode)
                        .durationMs(durationMs)
                        .requestSizeBytes(requestBytes)
                        .responseSizeBytes(responseBytes)
                        .build();

        input.pipeInput(
                UUID.randomUUID().toString(),
                request,
                timestamp
        );
    }

    // ========================================================================
    // ANALYTICS METRIC CREATION
    // ========================================================================

    private KafkaMessage.AnalyticsMetrics createMetric(
            AnalyticsBucket bucket,
            AnalyticsScope scope,
            UUID entityId,
            Instant timestamp,
            long latency
    ) {

        KafkaMessage.AnalyticsMetrics metric =
                new KafkaMessage.AnalyticsMetrics(
                        bucket,
                        scope,
                        entityId
                );

        metric.setTimestamp(timestamp);

        metric.setRequestCount(1);
        metric.setErrorCount(0);

        metric.setStatus2xx(1);
        metric.setStatus3xx(0);
        metric.setStatus4xx(0);
        metric.setStatus5xx(0);

        metric.setLatencySumMs(latency);
        metric.setLatencyMinMs(latency);
        metric.setLatencyMaxMs(latency);

        metric.setRequestBytesTotal(1000);
        metric.setResponseBytesTotal(100);

        metric.getLatencyHistogram()
                .recordValue(latency);

        return metric;
    }

    // ========================================================================
    // COMPOSITE KEYS
    // ========================================================================

    private String endpointKey(TestData data) {

        return endpointKey(
                data.tenantId(),
                data.productId(),
                data.serviceId(),
                data.endpointId()
        );
    }

    private String endpointKey(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId
    ) {

        return tenantId + "|"
                + productId + "|"
                + serviceId + "|"
                + endpointId;
    }

    private String serviceKey(TestData data) {

        return serviceKey(
                data.tenantId(),
                data.productId(),
                data.serviceId()
        );
    }

    private String serviceKey(
            UUID tenantId,
            UUID productId,
            UUID serviceId
    ) {

        return tenantId + "|"
                + productId + "|"
                + serviceId;
    }

    private String productKey(TestData data) {

        return productKey(
                data.tenantId(),
                data.productId()
        );
    }

    private String productKey(
            UUID tenantId,
            UUID productId
    ) {

        return tenantId + "|"
                + productId;
    }

    private String tenantKey(TestData data) {

        return tenantKey(data.tenantId());
    }

    private String tenantKey(UUID tenantId) {

        return tenantId.toString();
    }

    // ========================================================================
    // RESULT FINDER
    // ========================================================================

    private KafkaMessage.AnalyticsMetrics findFirstResultForTimestamp(
            List<KeyValue<String, KafkaMessage.AnalyticsMetrics>> results,
            Instant expectedTimestamp,
            AnalyticsBucket bucket
    ) {
        Instant expectedWindowTimestamp =
                truncateTimestamp(expectedTimestamp, bucket);

        return results.stream()
                .map((val)->val.value)
                .filter(value -> value != null)
                .filter(value ->
                        expectedWindowTimestamp.equals(value.getTimestamp())
                )
                .findFirst()
                .orElse(null);
    }

    // ========================================================================
    // ASSERTIONS
    // ========================================================================

    private void assertBasicAnalytics(
            KafkaMessage.AnalyticsMetrics result,
            AnalyticsBucket bucket,
            AnalyticsScope scope,
            long requestCount,
            long errorCount,
            long status2xx,
            long status3xx,
            long status4xx,
            long status5xx,
            long latencySum,
            long latencyMin,
            long latencyMax,
            long requestBytes,
            long responseBytes
    ) {

        assertThat(result.getBucket())
                .isEqualTo(bucket);

        assertThat(result.getScope())
                .isEqualTo(scope);

        assertThat(result.getRequestCount())
                .isEqualTo(requestCount);

        assertThat(result.getErrorCount())
                .isEqualTo(errorCount);

        assertThat(result.getStatus2xx())
                .isEqualTo(status2xx);

        assertThat(result.getStatus3xx())
                .isEqualTo(status3xx);

        assertThat(result.getStatus4xx())
                .isEqualTo(status4xx);

        assertThat(result.getStatus5xx())
                .isEqualTo(status5xx);

        assertThat(result.getLatencySumMs())
                .isEqualTo(latencySum);

        assertThat(result.getLatencyMinMs())
                .isEqualTo(latencyMin);

        assertThat(result.getLatencyMaxMs())
                .isEqualTo(latencyMax);

        assertThat(result.getRequestBytesTotal())
                .isEqualTo(requestBytes);

        assertThat(result.getResponseBytesTotal())
                .isEqualTo(responseBytes);

        assertThat(result.getLatencyHistogram())
                .isNotNull();

        assertThat(result.getLatencyHistogram().getTotalCount())
                .isEqualTo(requestCount);

        assertThat(
                result.getLatencyHistogram()
                        .getValueAtPercentile(50.0)
        ).isEqualTo(latencySum / requestCount);
    }

    // ========================================================================
    // TEST DATA
    // ========================================================================

    private TestData createTestData() {

        return new TestData(
                UUID.randomUUID(),
                UUID.randomUUID(),
                UUID.randomUUID(),
                UUID.randomUUID()
        );
    }

    private record TestData(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            UUID endpointId
    ) {
    }

    // ========================================================================
    // TIMESTAMP
    // ========================================================================

    private Instant truncateTimestamp(
            Instant timestamp,
            AnalyticsBucket bucket
    ) {

        return switch (bucket) {

            case MINUTE ->
                    timestamp.truncatedTo(
                            ChronoUnit.MINUTES
                    );

            case HOUR ->
                    timestamp.truncatedTo(
                            ChronoUnit.HOURS
                    );

            case DAY ->
                    timestamp.truncatedTo(
                            ChronoUnit.DAYS
                    );
        };
    }

    private void assertEntityId(
            KafkaMessage.AnalyticsMetrics result,
            TestData data,
            AnalyticsScope scope
    ) {
        UUID expectedEntityId = switch (scope) {
            case ENDPOINT -> data.endpointId();
            case SERVICE -> data.serviceId();
            case PRODUCT -> data.productId();
            case TENANT -> data.tenantId();
        };

        assertThat(result.getEntityId())
                .as("Entity ID for scope %s", scope)
                .isEqualTo(expectedEntityId);
    }
}