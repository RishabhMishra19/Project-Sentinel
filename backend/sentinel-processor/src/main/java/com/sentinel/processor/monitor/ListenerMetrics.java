package com.sentinel.processor.monitor;

import com.sentinel.common.cassandra.CassandraBatchInsertUtil;
import com.sentinel.common.cassandra.CassandraTables;
import com.sentinel.common.kafka.KafkaTopics;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class ListenerMetrics {

    public record TopicMetrics(Counter totalPolled, Counter totalFailed, Timer batchProcessingLatency) {
    }

    public record CassandraMetrics(Counter totalWrites, Counter totalFailed, Timer latency) {
    }

    private final MeterRegistry meterRegistry;
    private final ConcurrentHashMap<String, TopicMetrics> metricsByTopic;
    private final ConcurrentHashMap<String, CassandraMetrics> cassandraMetricsByTable;

    public ListenerMetrics(MeterRegistry registry) {
        this.meterRegistry = registry;
        this.metricsByTopic = new ConcurrentHashMap<>();
        this.cassandraMetricsByTable = new ConcurrentHashMap<>();

        for (String topic : KafkaTopics.getAllTopics()) {
            metricsByTopic.put(topic, new TopicMetrics(Counter.builder("sentinel_processor_records_polled_total").tag("topic", topic)
                .description("Total records polled by the processor").register(meterRegistry),

                Counter.builder("sentinel_processor_records_failed_total").tag("topic", topic)
                    .description("Total records failed during processor processing").register(meterRegistry),

                Timer.builder("sentinel_processor_record_processing_duration").tag("topic", topic)
                    .description("Processor record processing duration").publishPercentileHistogram().register(meterRegistry)));
        }

        for (String table : CassandraTables.getAllTables()) {
            cassandraMetricsByTable.put(table, new CassandraMetrics(
                Counter.builder("sentinel_processor_cassandra_writes_total").tag("table", table).description("Total Cassandra writes")
                    .register(meterRegistry),

                Counter.builder("sentinel_processor_cassandra_write_failures_total").tag("table", table)
                    .description("Total failed Cassandra writes").register(meterRegistry),

                Timer.builder("sentinel_processor_cassandra_write_duration").tag("table", table)
                    .description("Cassandra write batch duration")
                    .publishPercentileHistogram().register(meterRegistry)));
        }
    }

    public void recordProcessing(String topic, int batchSize, ThrowingRunnable operation) {
        TopicMetrics metrics = metricsByTopic.get(topic);

        if (metrics == null) {
            throw new IllegalArgumentException("Unknown topic: " + topic);
        }

        Timer.Sample sample = Timer.start(meterRegistry);

        try {
            metrics.totalPolled.increment(batchSize);
            operation.run();
        } catch (Exception e) {
            metrics.totalFailed.increment(batchSize);

            throw new RuntimeException("Kafka listener processing failed for topic: " + topic, e);
        } finally {
            sample.stop(metrics.batchProcessingLatency);
        }
    }

    public void recordCassandra(String table, CassandraBatchInsertUtil.BatchInsertResult result) {
        CassandraMetrics metrics = cassandraMetricsByTable.get(table);
        metrics.totalWrites.increment(result.total());
        metrics.totalFailed.increment(result.failed());
        metrics.latency.record(result.latencyMs(), TimeUnit.MILLISECONDS);
    }

    @FunctionalInterface
    public interface ThrowingRunnable {
        void run() throws Exception;
    }

}
