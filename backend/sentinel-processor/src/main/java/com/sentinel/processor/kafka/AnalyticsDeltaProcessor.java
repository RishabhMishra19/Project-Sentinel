package com.sentinel.processor.kafka;

import com.sentinel.common.kafka.AnalyticsDeltaMessage;
import com.sentinel.processor.analytics.AnalyticsRollupService;
import com.sentinel.processor.analytics.AnalyticsRollupService.Batch;
import com.sentinel.processor.catalog.EndpointResolveService;
import com.sentinel.processor.metrics.WorkerPipelineMetrics;
import com.sentinel.processor.support.ServiceHierarchy;
import com.sentinel.processor.support.ServiceHierarchyResolver;
import io.micrometer.core.instrument.Timer;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnalyticsDeltaProcessor {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsDeltaProcessor.class);

    private final EndpointResolveService endpointResolveService;
    private final ServiceHierarchyResolver serviceHierarchyResolver;
    private final AnalyticsRollupService analyticsRollupService;
    private final WorkerPipelineMetrics metrics;

    public AnalyticsDeltaProcessor(
            EndpointResolveService endpointResolveService,
            ServiceHierarchyResolver serviceHierarchyResolver,
            AnalyticsRollupService analyticsRollupService,
            WorkerPipelineMetrics metrics) {
        this.endpointResolveService = endpointResolveService;
        this.serviceHierarchyResolver = serviceHierarchyResolver;
        this.analyticsRollupService = analyticsRollupService;
        this.metrics = metrics;
    }

    @Transactional
    public void process(List<AnalyticsDeltaMessage> deltas) {
        if (deltas.isEmpty()) {
            return;
        }

        Timer.Sample sample = metrics.startStage();
        try {
            Map<EndpointKey, UUID> endpointCache = new HashMap<>();
            Map<UUID, ServiceHierarchy> hierarchyCache = new HashMap<>();
            Batch batch = analyticsRollupService.beginBatch();

            for (AnalyticsDeltaMessage delta : deltas) {
                EndpointKey key =
                        new EndpointKey(delta.serviceId(), delta.method(), delta.pathTemplate());
                UUID endpointId = endpointCache.computeIfAbsent(
                        key,
                        k -> endpointResolveService.resolve(
                                k.serviceId(),
                                k.method(),
                                k.pathTemplate(),
                                delta.minuteBucket()));
                ServiceHierarchy hierarchy = hierarchyCache.computeIfAbsent(
                        delta.serviceId(), serviceHierarchyResolver::resolve);
                batch.recordDelta(delta, endpointId, hierarchy);
            }
            batch.flush();
            metrics.recordAnalyticsFlush(sample);
            metrics.recordAnalyticsDeltasProcessed(deltas.size());
        } catch (RuntimeException ex) {
            log.error("Failed to process analytics delta batch size={}", deltas.size(), ex);
            throw ex;
        }
    }

    private record EndpointKey(UUID serviceId, String method, String pathTemplate) {}
}
