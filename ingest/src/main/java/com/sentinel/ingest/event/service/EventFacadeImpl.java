package com.sentinel.ingest.event.service;

import com.sentinel.common.kafka.RequestEventMessage;
import com.sentinel.ingest.event.dto.request.IngestEventItem;
import com.sentinel.ingest.event.dto.request.IngestEventsRequest;
import com.sentinel.ingest.event.service.core.InstanceOwnershipService;
import com.sentinel.ingest.event.service.core.RequestEventPublisher;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class EventFacadeImpl implements EventFacade {

    private final InstanceOwnershipService instanceOwnershipService;
    private final RequestEventPublisher requestEventPublisher;

    public EventFacadeImpl(
            InstanceOwnershipService instanceOwnershipService,
            RequestEventPublisher requestEventPublisher) {
        this.instanceOwnershipService = instanceOwnershipService;
        this.requestEventPublisher = requestEventPublisher;
    }

    @Override
    public void ingest(UUID serviceId, IngestEventsRequest request) {
        List<UUID> instanceIds = request.events().stream()
                .map(IngestEventItem::serviceInstanceId)
                .toList();
        instanceOwnershipService.assertOwnedByService(instanceIds, serviceId);

        Instant receivedAt = Instant.now();
        List<RequestEventMessage> messages = request.events().stream()
                .map(event -> toMessage(serviceId, event, receivedAt))
                .toList();
        requestEventPublisher.publish(messages);
    }

    private static RequestEventMessage toMessage(
            UUID serviceId, IngestEventItem event, Instant receivedAt) {
        return new RequestEventMessage(
                serviceId,
                event.serviceInstanceId(),
                event.method(),
                event.path(),
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
