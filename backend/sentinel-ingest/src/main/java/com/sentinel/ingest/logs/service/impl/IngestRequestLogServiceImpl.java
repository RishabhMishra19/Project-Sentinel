package com.sentinel.ingest.logs.service.impl;

import com.sentinel.common.crypto.Sha256Hasher;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.postgresql.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import com.sentinel.ingest.common.exception.BadRequestException;
import com.sentinel.ingest.common.exception.NotFoundException;
import com.sentinel.ingest.common.exception.UnauthorizedException;
import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.dto.response.IngestLogResponse;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import com.sentinel.ingest.logs.service.EndpointService;
import com.sentinel.ingest.logs.service.IngestRequestLogService;
import com.sentinel.ingest.utils.IngestCache;
import com.sentinel.ingest.utils.PathTemplateDeriver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
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
    private final KafkaTemplate<String, KafkaMessage.ReqLog> kafkaTemplate;
    private final IngestCache ingestCache;
    private final ServiceIdentityResolverRepository serviceIdentityResolverRepository;
    private final EndpointService endpointService;

    @Override
    public IngestLogResponse ingest(IngestLogRequest request) {
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = this.resolveServiceIdentity(request.serviceId());
        if (serviceIdentity == null)
            throw new NotFoundException("Service Not Found");
        boolean exists = this.existsApiKey(request.apiKey(), request.serviceId());
        if (!exists)
            throw new UnauthorizedException("Api key not found");
        this.upsertEndpointsAndUpdateRequest(request);
        try {
            List<KafkaMessage.ReqLog> reqLogs = request.toReqLogKafkaMessage(serviceIdentity);
            for (KafkaMessage.ReqLog reqLog : reqLogs) {
                kafkaTemplate.send(
                        new ProducerRecord<>(KafkaTopics.request_logs, null, System.currentTimeMillis(), reqLog.requestId(), reqLog))
                    .get();
            }
            return new IngestLogResponse("Successfully ingested", true);
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new IngestLogResponse("Failed to serialize Kafka message", false);
        }
    }

    private ServiceIdentityResolverRepository.ServiceIdentity resolveServiceIdentity(UUID serviceId) {
        String key = SERVICE_IDENTITY_KEY + serviceId.toString();
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = ingestCache.resolve(key);
        if (serviceIdentity == null) {
            serviceIdentity = serviceIdentityResolverRepository.resolveServiceIdentity(serviceId);
            ingestCache.store(key, TTL_IN_MS, serviceIdentity);
        }
        return serviceIdentity;
    }

    private boolean existsApiKey(String apiKey, UUID serviceId) {
        String key = API_KEY + serviceId.toString() + "_" + apiKey;
        Boolean exists = ingestCache.resolve(key);
        if (exists == null) {
            String keyHash = Sha256Hasher.hash(apiKey);
            exists = serviceApiKeyRepository.existsByKeyHashAndServiceIdAndStatus(keyHash, serviceId, ServiceApiKeyStatus.ACTIVE);
            ingestCache.store(key, 60 * 1000, exists);
        }
        return exists;
    }

    private void upsertEndpointsAndUpdateRequest(IngestLogRequest request) {
        Set<EndpointKey> endpointKeys = new HashSet<>();
        for (IngestLogRequest.RequestLogRequest requestLogRequest : request.requests()) {
            String pathTemplate = pathTemplateDeriver.derive(requestLogRequest.getPath());
            String method = requestLogRequest.getMethod();
            UUID serviceId = request.serviceId();
            endpointKeys.add(new EndpointKey(serviceId, method, pathTemplate));
        }
        endpointService.bulkInsertEndpoints(endpointKeys.stream().map(v -> Endpoint.builder()
            .serviceId(v.serviceId())
            .pathTemplate(v.pathTemplate())
            .method(v.method())
            .firstSeenAt(Instant.now())
            .lastSeenAt(Instant.now())
            .build()).toList());
        Map<String, Map<String, UUID>> pathTemplateMapping = endpointService.findPathTemplateMappingForService(request.serviceId());
        List<UUID> endpointIds = new ArrayList<>();
        for (IngestLogRequest.RequestLogRequest requestLogRequest : request.requests()) {
            String pathTemplate = pathTemplateDeriver.derive(requestLogRequest.getPath());
            String method = requestLogRequest.getMethod();
            requestLogRequest.setPathTemplate(pathTemplate);
            requestLogRequest.setEndpointId(pathTemplateMapping.get(pathTemplate).get(method));
            endpointIds.add(requestLogRequest.getEndpointId());
        }
        endpointService.bulkUpdateLastSeenToNow(endpointIds);
    }

    public record EndpointKey(UUID serviceId, String method, String pathTemplate) {
    }

}
