package com.sentinel.ingest.logs.service.impl;

import com.sentinel.common.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.common.crypto.Sha256Hasher;
import com.sentinel.common.kafka.RequestLogKafkaMessage;
import com.sentinel.common.observability.entity.Endpoint;
import com.sentinel.common.observability.entity.EndpointLookup;
import com.sentinel.common.observability.repository.EndpointLookupRepository;
import com.sentinel.ingest.common.exception.BadRequestException;
import com.sentinel.ingest.common.exception.NotFoundException;
import com.sentinel.ingest.common.exception.UnauthorizedException;
import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.dto.response.IngestLogResponse;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import com.sentinel.ingest.logs.service.IngestRequestLogService;
import com.sentinel.ingest.utils.IngestCache;
import com.sentinel.ingest.utils.PathTemplateDeriver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.cassandra.core.CassandraBatchOperations;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.data.cassandra.core.query.Criteria;
import org.springframework.data.cassandra.core.query.Query;
import org.springframework.data.cassandra.core.query.Update;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngestRequestLogServiceImpl implements IngestRequestLogService {

    private static final String SERVICE_IDENTITY_KEY = "service_identity_key_";
    private static final String API_KEY = "api_key_";
    private static final String ENDPOINT_TEMPLATE = "endpoint_template_";
    private static final int TTL_IN_MS = 300;

    @Value("${sentinel.kafka.request-logs-topic}")
    private String requestLogsTopic;
    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final PathTemplateDeriver pathTemplateDeriver;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final IngestCache ingestCache;
    private final ServiceIdentityResolverRepository serviceIdentityResolverRepository;
    private final EndpointLookupRepository endpointLookupRepository;
    private final CassandraTemplate cassandraTemplate;


    @Override
    public IngestLogResponse ingest(IngestLogRequest request) {
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = this.resolveServiceIdentity(request.serviceId());
        if (serviceIdentity == null) throw new NotFoundException("Service Not Found");
        boolean exists = this.existsApiKey(request.apiKey(), request.serviceId());
        if (!exists) throw new UnauthorizedException("Api key not found");
        this.upsertEndpointsAndUpdateRequest(request);

        try {
            RequestLogKafkaMessage kafkaMessage = request.toRequestEventMessages(pathTemplateDeriver,
                                                                                           serviceIdentity);
            String value = objectMapper.writeValueAsString(kafkaMessage);
            ProducerRecord<String, String> record = new ProducerRecord<>(requestLogsTopic,
                                                                         null,
                                                                         System.currentTimeMillis(),
                                                                         request.serviceId().toString(),
                                                                         value);
            kafkaTemplate.send(record).get();
            return new IngestLogResponse("Successfully ingested", true);
        } catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        } catch (Exception e) {
            log.error(e.getMessage(), e); return new IngestLogResponse("Failed to serialize Kafka message", false);
        }
    }

    private ServiceIdentityResolverRepository.ServiceIdentity resolveServiceIdentity(UUID serviceId) {
        String key = SERVICE_IDENTITY_KEY + serviceId.toString();
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = ingestCache.resolve(key);
        if(serviceIdentity == null){
            serviceIdentity = serviceIdentityResolverRepository.resolveServiceIdentity(serviceId);
            ingestCache.store(key, TTL_IN_MS,  serviceIdentity);
        }
        return serviceIdentity;
    }

    private boolean existsApiKey(String apiKey, UUID serviceId) {
        String key = API_KEY + serviceId.toString()+"_"+apiKey;
        Boolean exists = ingestCache.resolve(key);
        if(exists == null){
            String keyHash = Sha256Hasher.hash(apiKey);
            exists = serviceApiKeyRepository.existsByKeyHashAndServiceIdAndStatus(keyHash, serviceId,
                                                                                  ServiceApiKeyStatus.ACTIVE);
            ingestCache.store(key, TTL_IN_MS,  exists);
        }
        return exists;
    }

    private void upsertEndpointsAndUpdateRequest(IngestLogRequest request) {
        CassandraBatchOperations batch = cassandraTemplate.batchOps();
        Instant now = Instant.now();
        for(IngestLogRequest.RequestLogRequest requestLogRequest : request.requests()){
            String pathTemplate = pathTemplateDeriver.derive(requestLogRequest.getPath());
            EndpointLookup.PrimaryKeyComposite id = new  EndpointLookup.PrimaryKeyComposite(
                    request.serviceId(),
                    requestLogRequest.getMethod(),
                    pathTemplate
            );
            UUID endpointId = this.getEndpointId(id);
            if(endpointId != null){
                batch.update(
                        Query.query(
                                Criteria.where("service_id").is(id.getServiceId())
                        ).and(
                                Criteria.where("id").is(endpointId)
                        ),
                        Update.update("last_seen_at", now),
                        Endpoint.class
                );
            } else {
                endpointId = UUID.randomUUID();
                batch.insert(new Endpoint(
                        new Endpoint.PrimaryKeyComposite(id.getServiceId(), endpointId),
                        id.getMethod(),
                        id.getPathTemplate(),
                        now,
                        now
                ));
                batch.insert(new EndpointLookup(
                        id,
                        endpointId
                ));
            }
            requestLogRequest.setPathTemplate(pathTemplate);
            requestLogRequest.setEndpointId(endpointId);
        }

        batch.execute();
    }

    private UUID getEndpointId(EndpointLookup.PrimaryKeyComposite id) {
        String key = ENDPOINT_TEMPLATE + id.getServiceId().toString() + "_" + id.getMethod() + "_" + id.getPathTemplate();
        UUID endpointId = ingestCache.resolve(key);
        if(endpointId != null){
            EndpointLookup lookup = endpointLookupRepository.findById(id).orElse(null);
            if(lookup != null){
                endpointId = lookup.getEndpointId();
                ingestCache.store(key, TTL_IN_MS,  endpointId);
            }
        }
        return endpointId;
    }

}
