package com.sentinel.ingest.logs.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinel.common.crypto.Sha256Hasher;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.postgresql.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.ingest.common.exception.NotFoundException;
import com.sentinel.ingest.common.exception.UnauthorizedException;
import com.sentinel.ingest.logs.dto.EndpointKey;
import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import com.sentinel.ingest.logs.service.EndpointService;
import com.sentinel.ingest.logs.service.IngestRequestLogService;
import com.sentinel.ingest.monitor.IngestKafkaMetrics;
import com.sentinel.ingest.utils.IngestCache;
import com.sentinel.ingest.utils.PathTemplateDeriver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngestRequestLogServiceImpl implements IngestRequestLogService {

    private static final String SERVICE_IDENTITY_KEY = "service_identity_key_";
    private static final String API_KEY = "api_key_";
    private static final int TTL_IN_MS = 10 * 60 * 1000;
    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final PathTemplateDeriver pathTemplateDeriver;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final IngestCache ingestCache;
    private final ServiceIdentityResolverRepository serviceIdentityResolverRepository;
    private final EndpointService endpointService;
    private final ObjectMapper objectMapper;
    private final IngestKafkaMetrics ingestKafkaMetrics;

    @Override
    public void ingest(IngestLogRequest request) {
        /* Service identity */
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = this.resolveServiceIdentity(request.serviceId());

        if (serviceIdentity == null) {
            throw new NotFoundException("Service Not Found");
        }

        /* API key validation */
        boolean exists = this.existsApiKey(request.apiKey(), request.serviceId());

        if (!exists) {
            throw new UnauthorizedException("Api key not found");
        }

        /* Endpoint processing */
        this.upsertEndpointsAndUpdateRequest(request);

        /* Kafka */
        List<KafkaMessage.ReqLog> reqLogs = request.toReqLogKafkaMessages(serviceIdentity);

        for (KafkaMessage.ReqLog reqLog : reqLogs) {
            KafkaMessage.AnalyticsKey analyticsKey =
                new KafkaMessage.AnalyticsKey(reqLog.tenantId(), reqLog.productId(), reqLog.serviceId(), reqLog.endpointId());
            ingestKafkaMetrics.recordPublish(() ->
                kafkaTemplate.send(
                    new ProducerRecord<>(
                        KafkaTopics.request_logs,
                        null,
                        System.currentTimeMillis(),
                        analyticsKey.getBase64Str(objectMapper),
                        objectMapper.writeValueAsString(reqLog)
                    )
                ).get());
        }

    }

    private void upsertEndpointsAndUpdateRequest(IngestLogRequest request) {
        Set<EndpointKey> endpointKeys = new HashSet<>();
        for (IngestLogRequest.RequestLogRequest requestLogRequest : request.requests()) {
            String pathTemplate = pathTemplateDeriver.derive(requestLogRequest.getPath());
            String method = requestLogRequest.getMethod();
            UUID serviceId = request.serviceId();

            endpointKeys.add(new EndpointKey(serviceId, method, pathTemplate));
            requestLogRequest.setPathTemplate(pathTemplate);
        }
        Map<EndpointKey, UUID> endpointIdMapping = endpointService.upsertEndpointsAndReturnIdMapping(endpointKeys);
        for (IngestLogRequest.RequestLogRequest requestLogRequest : request.requests()) {
            requestLogRequest.setEndpointId(
                endpointIdMapping.get(
                    new EndpointKey(
                        request.serviceId(),
                        requestLogRequest.getMethod(),
                        requestLogRequest.getPathTemplate()
                    )
                )
            );
        }
    }

    private ServiceIdentityResolverRepository.ServiceIdentity resolveServiceIdentity(UUID serviceId) {
        String key = SERVICE_IDENTITY_KEY + serviceId;
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = ingestCache.resolve(key);

        if (serviceIdentity == null) {
            serviceIdentity = serviceIdentityResolverRepository.resolveServiceIdentity(serviceId);
            ingestCache.store(key, TTL_IN_MS, serviceIdentity);
        }

        return serviceIdentity;
    }

    private boolean existsApiKey(String apiKey, UUID serviceId) {
        String key = API_KEY + serviceId + "_" + apiKey;
        Boolean exists = ingestCache.resolve(key);

        if (exists == null) {
            String keyHash = Sha256Hasher.hash(apiKey);
            exists = serviceApiKeyRepository.existsByKeyHashAndServiceIdAndStatus(
                keyHash,
                serviceId,
                ServiceApiKeyStatus.ACTIVE
            );
            ingestCache.store(key, 60 * 1000, exists);
        }

        return exists;
    }

}
