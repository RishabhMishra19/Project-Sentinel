package com.sentinel.ingest.monitor;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class IngestKafkaMetrics {

    private final MeterRegistry meterRegistry;
    private final Counter published;
    private final Counter failures;
    private final Timer latency;

    public IngestKafkaMetrics(MeterRegistry registry) {
        this.meterRegistry = registry;
        published = Counter.builder("sentinel_ingest_kafka_published_total").description("Total records published by ingest to Kafka")
            .register(registry);

        failures =
            Counter.builder("sentinel_ingest_kafka_publish_failures_total").description("Total Kafka publish failures").register(registry);

        latency = Timer.builder("sentinel_ingest_kafka_publish_duration").description("Kafka publish latency from ingest")
            .publishPercentileHistogram().register(registry);
    }

    public void recordPublish(ThrowingRunnable operation) {
        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            operation.run();
            published.increment();
        } catch (Exception e) {
            failures.increment();
            throw new RuntimeException("Kafka publish failed", e);
        } finally {
            sample.stop(latency);
        }
    }

    @FunctionalInterface
    public interface ThrowingRunnable {
        void run() throws Exception;
    }

}
