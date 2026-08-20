package com.sentinel.processor.kafka;

import com.sentinel.common.kafka.RequestLogKafkaMessage;
import com.sentinel.common.path.PathTemplateDeriver;
import com.sentinel.processor.catalog.EndpointResolveService;
import com.sentinel.processor.logs.RequestLogWriteService;
import com.sentinel.processor.logs.RequestLogWriteService.ResolvedEvent;
import com.sentinel.processor.metrics.WorkerPipelineMetrics;
import io.micrometer.core.instrument.Timer;
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
    private final WorkerPipelineMetrics metrics;

    public RequestEventProcessor(
            EndpointResolveService endpointResolveService,
            RequestLogWriteService requestLogWriteService,
            WorkerPipelineMetrics metrics) {
        this.endpointResolveService = endpointResolveService;
        this.requestLogWriteService = requestLogWriteService;
        this.metrics = metrics;
    }

    @Transactional
    public void process(List<RequestLogKafkaMessage> messages) {
        if (messages.isEmpty()) {
            return;
        }

        Timer.Sample sample = metrics.startBatch();
        boolean success = false;
        try {
            Map<EndpointKey, UUID> endpointCache = new HashMap<>();
            List<ResolvedEvent> resolved = new ArrayList<>(messages.size());

            for (RequestLogKafkaMessage message : messages) {
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
                                    k.serviceId(),
                                    k.method(),
                                    k.pathTemplate(),
                                    message.occurredAt()));

                    resolved.add(new ResolvedEvent(message, endpointId));
                } catch (RuntimeException ex) {
                    log.error(
                            "Failed to process request event serviceId={} path={}",
                            message.serviceId(),
                            message.path(),
                            ex);
                    throw ex;
                }
            }

            Timer.Sample logsSample = metrics.startStage();
            requestLogWriteService.saveAll(resolved);
            metrics.recordLogsWrite(logsSample);

            metrics.recordBatchSuccess(sample, messages.size());
            success = true;
            if (log.isDebugEnabled()) {
                log.debug("Processed batch size={}", messages.size());
            }
        } finally {
            if (!success) {
                metrics.recordBatchFailure(sample);
            }
        }
    }

    private record EndpointKey(UUID serviceId, String method, String pathTemplate) {}
}
