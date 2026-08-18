package com.sentinel.ingest.event.service;

import com.sentinel.common.kafka.RequestEventMessage;
import com.sentinel.common.path.PathTemplateDeriver;
import com.sentinel.ingest.analytics.AnalyticsDeltaAccumulator;
import com.sentinel.ingest.event.dto.request.IngestEventItem;
import com.sentinel.ingest.event.dto.request.IngestEventsRequest;
import com.sentinel.ingest.event.service.core.InstanceOwnershipService;
import com.sentinel.ingest.event.service.core.RequestEventPublisher;
import com.sentinel.ingest.metrics.IngestPipelineMetrics;
import io.micrometer.core.instrument.Timer;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class EventFacadeImpl implements EventFacade {

    private final InstanceOwnershipService instanceOwnershipService;
    private final RequestEventPublisher requestEventPublisher;
    private final AnalyticsDeltaAccumulator analyticsDeltaAccumulator;
    private final PathTemplateDeriver pathTemplateDeriver = new PathTemplateDeriver();
    private final IngestPipelineMetrics metrics;

    public EventFacadeImpl(
            InstanceOwnershipService instanceOwnershipService,
            RequestEventPublisher requestEventPublisher,
            AnalyticsDeltaAccumulator analyticsDeltaAccumulator,
            IngestPipelineMetrics metrics) {
        this.instanceOwnershipService = instanceOwnershipService;
        this.requestEventPublisher = requestEventPublisher;
        this.analyticsDeltaAccumulator = analyticsDeltaAccumulator;
        this.metrics = metrics;
    }

    @Override
    public void ingest(UUID serviceId, IngestEventsRequest request) {
        Timer.Sample sample = metrics.startPublish();
        List<UUID> instanceIds = request.events().stream()
                .map(IngestEventItem::serviceInstanceId)
                .toList();
        instanceOwnershipService.assertOwnedByService(instanceIds, serviceId);

        Instant receivedAt = Instant.now();
        List<RequestEventMessage> messages = new ArrayList<>(request.events().size());
        for (IngestEventItem event : request.events()) {
            String method = pathTemplateDeriver.normalizeMethod(event.method());
            String pathTemplate = pathTemplateDeriver.derive(event.path());
            UUID ownerServiceId = instanceOwnershipService.resolveServiceId(event.serviceInstanceId());
            if (ownerServiceId == null) {
                ownerServiceId = serviceId;
            }
            messages.add(toMessage(serviceId, event, method, pathTemplate, receivedAt));
            analyticsDeltaAccumulator.record(ownerServiceId, method, pathTemplate, event);
        }
        requestEventPublisher.publish(messages);
        metrics.recordPublishSuccess(sample, messages.size());
    }

    private static RequestEventMessage toMessage(
            UUID serviceId,
            IngestEventItem event,
            String method,
            String pathTemplate,
            Instant receivedAt) {
        return new RequestEventMessage(
                serviceId,
                event.serviceInstanceId(),
                method,
                event.path(),
                pathTemplate,
                event.occurredAt(),
                receivedAt,
                event.statusCode(),
                event.durationMs(),
                event.endUserIp(),
                event.requestSizeBytes(),
                event.responseSizeBytes(),
                event.requestId(),
                event.userId());
    }
}
