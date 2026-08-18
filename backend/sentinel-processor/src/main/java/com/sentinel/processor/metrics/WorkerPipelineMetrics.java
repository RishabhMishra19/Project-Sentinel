package com.sentinel.processor.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class WorkerPipelineMetrics {

    private final Timer batchProcessTimer;
    private final Timer failedBatchTimer;
    private final Timer analyticsFlushTimer;
    private final Timer logsWriteTimer;
    private final Counter eventsProcessed;
    private final Counter batchesProcessed;
    private final Counter batchFailures;
    private final Counter analyticsDeltasProcessed;
    private final DistributionSummary batchSize;

    public WorkerPipelineMetrics(MeterRegistry registry) {
        this.batchProcessTimer = Timer.builder("sentinel.worker.batch.process")
                .description("Time to process one Kafka consumer batch")
                .publishPercentileHistogram()
                .register(registry);
        this.failedBatchTimer = Timer.builder("sentinel.worker.batch.process.failed")
                .description("Time spent on Kafka batches that failed")
                .register(registry);
        this.analyticsFlushTimer = Timer.builder("sentinel.worker.batch.analytics")
                .description("Time to flush analytics rollups for one batch")
                .publishPercentileHistogram()
                .register(registry);
        this.logsWriteTimer = Timer.builder("sentinel.worker.batch.logs")
                .description("Time to batch-insert request_logs for one batch")
                .publishPercentileHistogram()
                .register(registry);
        this.eventsProcessed = Counter.builder("sentinel.worker.events.processed")
                .description("Request events successfully processed by the worker")
                .register(registry);
        this.batchesProcessed = Counter.builder("sentinel.worker.batches.processed")
                .description("Kafka batches successfully processed")
                .register(registry);
        this.batchFailures = Counter.builder("sentinel.worker.batches.failed")
                .description("Kafka batches that failed during processing")
                .register(registry);
        this.analyticsDeltasProcessed = Counter.builder("sentinel.worker.analytics.deltas.processed")
                .description("Analytics delta messages successfully applied")
                .register(registry);
        this.batchSize = DistributionSummary.builder("sentinel.worker.batch.size")
                .description("Number of events per Kafka batch")
                .publishPercentileHistogram()
                .register(registry);
    }

    public Timer.Sample startBatch() {
        return Timer.start();
    }

    public Timer.Sample startStage() {
        return Timer.start();
    }

    public void recordAnalyticsFlush(Timer.Sample sample) {
        sample.stop(analyticsFlushTimer);
    }

    public void recordLogsWrite(Timer.Sample sample) {
        sample.stop(logsWriteTimer);
    }

    public void recordAnalyticsDeltasProcessed(int count) {
        analyticsDeltasProcessed.increment(count);
    }

    public void recordBatchSuccess(Timer.Sample sample, int size) {
        sample.stop(batchProcessTimer);
        batchSize.record(size);
        eventsProcessed.increment(size);
        batchesProcessed.increment();
    }

    public void recordBatchFailure(Timer.Sample sample) {
        sample.stop(failedBatchTimer);
        batchFailures.increment();
    }
}
