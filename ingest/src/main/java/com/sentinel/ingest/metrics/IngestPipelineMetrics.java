package com.sentinel.ingest.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.DistributionSummary;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

@Component
public class IngestPipelineMetrics {

    private final Timer publishTimer;
    private final Counter eventsPublished;
    private final Counter publishRequests;
    private final Counter analyticsDeltasPublished;
    private final Counter analyticsBatchesPublished;
    private final DistributionSummary eventsPerRequest;

    public IngestPipelineMetrics(MeterRegistry registry) {
        this.publishTimer = Timer.builder("sentinel.ingest.publish")
                .description("Time to validate ownership and publish one ingest request to Kafka")
                .publishPercentileHistogram()
                .register(registry);
        this.eventsPublished = Counter.builder("sentinel.ingest.events.published")
                .description("Request events published to Kafka")
                .register(registry);
        this.publishRequests = Counter.builder("sentinel.ingest.requests")
                .description("Successful POST /v1/events requests")
                .register(registry);
        this.analyticsDeltasPublished = Counter.builder("sentinel.ingest.analytics.deltas.published")
                .description("Analytics delta keys included in flushed batches")
                .register(registry);
        this.analyticsBatchesPublished = Counter.builder("sentinel.ingest.analytics.batches.published")
                .description("Analytics delta batch envelopes published to Kafka")
                .register(registry);
        this.eventsPerRequest = DistributionSummary.builder("sentinel.ingest.request.events")
                .description("Events included in each ingest HTTP request")
                .publishPercentileHistogram()
                .register(registry);
    }

    public Timer.Sample startPublish() {
        return Timer.start();
    }

    public void recordPublishSuccess(Timer.Sample sample, int eventCount) {
        sample.stop(publishTimer);
        eventsPublished.increment(eventCount);
        publishRequests.increment();
        eventsPerRequest.record(eventCount);
    }

    public void recordAnalyticsBatchesPublished(int batches, int deltas) {
        analyticsBatchesPublished.increment(batches);
        analyticsDeltasPublished.increment(deltas);
    }
}
