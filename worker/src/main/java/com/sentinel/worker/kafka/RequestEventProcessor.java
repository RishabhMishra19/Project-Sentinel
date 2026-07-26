package com.sentinel.worker.kafka;

import com.sentinel.common.kafka.RequestEventMessage;
import com.sentinel.common.path.PathTemplateDeriver;
import com.sentinel.worker.analytics.AnalyticsRollupService;
import com.sentinel.worker.catalog.EndpointResolveService;
import com.sentinel.worker.logs.RequestLogWriteService;
import com.sentinel.worker.logs.RequestLogWriteService.ResolvedEvent;
import com.sentinel.worker.support.ServiceHierarchy;
import com.sentinel.worker.support.ServiceHierarchyResolver;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RequestEventProcessor {

    private static final Logger log = LoggerFactory.getLogger(RequestEventProcessor.class);

    private final PathTemplateDeriver pathTemplateDeriver = new PathTemplateDeriver();
    private final EndpointResolveService endpointResolveService;
    private final RequestLogWriteService requestLogWriteService;
    private final AnalyticsRollupService analyticsRollupService;
    private final ServiceHierarchyResolver serviceHierarchyResolver;

    public RequestEventProcessor(
            EndpointResolveService endpointResolveService,
            RequestLogWriteService requestLogWriteService,
            AnalyticsRollupService analyticsRollupService,
            ServiceHierarchyResolver serviceHierarchyResolver) {
        this.endpointResolveService = endpointResolveService;
        this.requestLogWriteService = requestLogWriteService;
        this.analyticsRollupService = analyticsRollupService;
        this.serviceHierarchyResolver = serviceHierarchyResolver;
    }

    @Transactional
    public void process(List<RequestEventMessage> messages) {
        if (messages.isEmpty()) {
            return;
        }

        Map<EndpointKey, UUID> endpointCache = new HashMap<>();
        Map<UUID, ServiceHierarchy> hierarchyCache = new HashMap<>();
        List<ResolvedEvent> resolved = new ArrayList<>(messages.size());

        for (RequestEventMessage message : messages) {
            try {
                String method = message.method() != null && !message.method().isBlank()
                        ? pathTemplateDeriver.normalizeMethod(message.method())
                        : pathTemplateDeriver.normalizeMethod(null);
                String pathTemplate = message.pathTemplate() != null && !message.pathTemplate().isBlank()
                        ? message.pathTemplate()
                        : pathTemplateDeriver.derive(message.path());
                EndpointKey key = new EndpointKey(message.serviceId(), method, pathTemplate);

                UUID endpointId = endpointCache.computeIfAbsent(
                        key,
                        k -> endpointResolveService.resolve(
                                k.serviceId(), k.method(), k.pathTemplate(), message.occurredAt()));

                ServiceHierarchy hierarchy = hierarchyCache.computeIfAbsent(
                        message.serviceId(), serviceHierarchyResolver::resolve);

                resolved.add(new ResolvedEvent(message, endpointId));
                analyticsRollupService.record(message, endpointId, hierarchy);
            } catch (RuntimeException ex) {
                log.error(
                        "Failed to process request event serviceId={} path={}",
                        message.serviceId(),
                        message.path(),
                        ex);
                throw ex;
            }
        }

        requestLogWriteService.saveAll(resolved);
    }

    private record EndpointKey(UUID serviceId, String method, String pathTemplate) {}
}
