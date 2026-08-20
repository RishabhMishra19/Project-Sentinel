package com.sentinel.ingest.logs.service.impl;

import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.common.kafka.RequestLogKafkaMessage;
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
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class IngestRequestLogServiceImpl implements IngestRequestLogService {

    @Value("${sentinel.kafka.request-logs-topic}")
    private String requestLogsTopic;
    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final PathTemplateDeriver pathTemplateDeriver;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final IngestCache ingestCache;


    @Override
    public IngestLogResponse ingest(IngestLogRequest request) {
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = ingestCache.resolveServiceIdentity(request.serviceId());
        if (serviceIdentity == null) throw new NotFoundException("Service Not Found");
        boolean exists = ingestCache.existsApiKey(request.apiKey(), request.serviceId());
        if (!exists) throw new UnauthorizedException("Api key not found");

        try {
            List<RequestLogKafkaMessage> kafkaMessageList = request.toRequestEventMessages(pathTemplateDeriver,
                                                                                           serviceIdentity);
            String value = objectMapper.writeValueAsString(kafkaMessageList);
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
}
