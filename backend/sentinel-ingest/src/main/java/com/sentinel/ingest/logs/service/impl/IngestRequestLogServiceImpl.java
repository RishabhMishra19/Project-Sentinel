package com.sentinel.ingest.logs.service.impl;

import com.sentinel.common.crypto.Sha256Hasher;
import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.common.kafka.KafkaTopics;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.postgresql.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.ingest.common.exception.BadRequestException;
import com.sentinel.ingest.common.exception.NotFoundException;
import com.sentinel.ingest.common.exception.UnauthorizedException;
import com.sentinel.ingest.logs.dto.EndpointKey;
import com.sentinel.ingest.logs.dto.request.IngestLogRequest;
import com.sentinel.ingest.logs.dto.response.IngestLogResponse;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import com.sentinel.ingest.logs.service.EndpointService;
import com.sentinel.ingest.logs.service.IngestRequestLogService;
import com.sentinel.ingest.utils.IngestCache;
import com.sentinel.ingest.utils.PathTemplateDeriver;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
public class IngestRequestLogServiceImpl implements IngestRequestLogService {

    private static final String SERVICE_IDENTITY_KEY = "service_identity_key_";
    private static final String API_KEY = "api_key_";
    private static final int TTL_IN_MS = 10 * 60 * 1000;
    private static final long THROUGHPUT_LOG_INTERVAL_NANOS = TimeUnit.SECONDS.toNanos(1);

    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final PathTemplateDeriver pathTemplateDeriver;
    private final KafkaTemplate<String, KafkaMessage.ReqLog> kafkaTemplate;
    private final IngestCache ingestCache;
    private final ServiceIdentityResolverRepository serviceIdentityResolverRepository;
    private final EndpointService endpointService;

    /* Timers for individual ingestion stages. */
    private final Timer resolveServiceIdentityTimer;
    private final Timer apiKeyValidationTimer;
    private final Timer endpointKeyProcessingTimer;
    private final Timer endpointUpsertTimer;
    private final Timer endpointMappingTimer;
    private final Timer endpointBulkInsertTimer;
    private final Timer endpointFindMappingTimer;
    private final Timer endpointBulkUpdateTimer;
    private final Timer kafkaSendTimer;

    /* Request counters. */
    private final AtomicLong totalReceived = new AtomicLong(0);
    private final AtomicLong totalCompleted = new AtomicLong(0);
    private final AtomicLong totalFailed = new AtomicLong(0);

    /* Used for calculating one-second throughput. */
    private final AtomicLong lastLoggedRequestCount = new AtomicLong(0);
    private final AtomicLong lastThroughputLogNanos = new AtomicLong(System.nanoTime());

    /* Previous timer values used to calculate per-second average stage latency. */
    private final AtomicLong lastResolveServiceIdentityCount = new AtomicLong(0);
    private final AtomicLong lastResolveServiceIdentityTotalNanos = new AtomicLong(0);
    private final AtomicLong lastApiKeyValidationCount = new AtomicLong(0);
    private final AtomicLong lastApiKeyValidationTotalNanos = new AtomicLong(0);
    private final AtomicLong lastEndpointKeyProcessingCount = new AtomicLong(0);
    private final AtomicLong lastEndpointKeyProcessingTotalNanos = new AtomicLong(0);
    private final AtomicLong lastEndpointUpsertCount = new AtomicLong(0);
    private final AtomicLong lastEndpointUpsertTotalNanos = new AtomicLong(0);
    private final AtomicLong lastEndpointMappingCount = new AtomicLong(0);
    private final AtomicLong lastEndpointMappingTotalNanos = new AtomicLong(0);
    private final AtomicLong lastEndpointBulkInsertCount = new AtomicLong(0);
    private final AtomicLong lastEndpointBulkInsertTotalNanos = new AtomicLong(0);
    private final AtomicLong lastEndpointFindMappingCount = new AtomicLong(0);
    private final AtomicLong lastEndpointFindMappingTotalNanos = new AtomicLong(0);
    private final AtomicLong lastEndpointBulkUpdateCount = new AtomicLong(0);
    private final AtomicLong lastEndpointBulkUpdateTotalNanos = new AtomicLong(0);
    private final AtomicLong lastKafkaSendCount = new AtomicLong(0);
    private final AtomicLong lastKafkaSendTotalNanos = new AtomicLong(0);

    public IngestRequestLogServiceImpl(
        ServiceApiKeyRepository serviceApiKeyRepository,
        PathTemplateDeriver pathTemplateDeriver,
        KafkaTemplate<String, KafkaMessage.ReqLog> kafkaTemplate,
        IngestCache ingestCache,
        ServiceIdentityResolverRepository serviceIdentityResolverRepository,
        EndpointService endpointService,
        MeterRegistry meterRegistry
    ) {
        this.serviceApiKeyRepository = serviceApiKeyRepository;
        this.pathTemplateDeriver = pathTemplateDeriver;
        this.kafkaTemplate = kafkaTemplate;
        this.ingestCache = ingestCache;
        this.serviceIdentityResolverRepository = serviceIdentityResolverRepository;
        this.endpointService = endpointService;

        this.resolveServiceIdentityTimer = buildTimer(meterRegistry, "sentinel.ingest.resolve-service-identity");
        this.apiKeyValidationTimer = buildTimer(meterRegistry, "sentinel.ingest.api-key-validation");
        this.endpointKeyProcessingTimer = buildTimer(meterRegistry, "sentinel.ingest.endpoint-key-processing");
        this.endpointUpsertTimer = buildTimer(meterRegistry, "sentinel.ingest.endpoint-upsert");
        this.endpointMappingTimer = buildTimer(meterRegistry, "sentinel.ingest.endpoint-mapping");
        this.endpointBulkInsertTimer = buildTimer(meterRegistry, "sentinel.ingest.endpoint-bulk-insert");
        this.endpointFindMappingTimer = buildTimer(meterRegistry, "sentinel.ingest.endpoint-find-mapping");
        this.endpointBulkUpdateTimer = buildTimer(meterRegistry, "sentinel.ingest.endpoint-bulk-update");
        this.kafkaSendTimer = buildTimer(meterRegistry, "sentinel.ingest.kafka-send");
    }

    private Timer buildTimer(MeterRegistry meterRegistry, String name) {
        return Timer.builder(name)
            .publishPercentiles(0.5, 0.95, 0.99)
            .publishPercentileHistogram()
            .register(meterRegistry);
    }

    @Override
    public IngestLogResponse ingest(IngestLogRequest request) {
        totalReceived.incrementAndGet();

        /* Try to print throughput and per-stage timing approximately once every second. */
        logThroughputIfNeeded();

        try {
            /* Service identity */
            ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity =
                resolveServiceIdentityTimer.record(() -> this.resolveServiceIdentity(request.serviceId()));

            if (serviceIdentity == null) {
                totalFailed.incrementAndGet();
                throw new NotFoundException("Service Not Found");
            }

            /* API key validation */
            boolean exists = apiKeyValidationTimer.record(() -> this.existsApiKey(request.apiKey(), request.serviceId()));

            if (!exists) {
                totalFailed.incrementAndGet();
                throw new UnauthorizedException("Api key not found");
            }

            /* Endpoint processing */
            this.processEndpoints(request);

            /* Kafka */
            List<KafkaMessage.ReqLog> reqLogs = request.toReqLogKafkaMessage(serviceIdentity);

            kafkaSendTimer.record(() -> {
                try {
                    for (KafkaMessage.ReqLog reqLog : reqLogs) {
                        kafkaTemplate.send(
                            new ProducerRecord<>(
                                KafkaTopics.request_logs,
                                null,
                                System.currentTimeMillis(),
                                reqLog.requestId(),
                                reqLog
                            )
                        ).get();
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });

            totalCompleted.incrementAndGet();

            return new IngestLogResponse("Successfully ingested", true);

        } catch (BadRequestException e) {
            totalFailed.incrementAndGet();
            throw new BadRequestException(e.getMessage());
        } catch (NotFoundException | UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            totalFailed.incrementAndGet();
            log.error(e.getMessage(), e);
            return new IngestLogResponse("Failed to serialize Kafka message", false);
        }
    }

    private void processEndpoints(IngestLogRequest request) {
        Set<EndpointKey> endpointKeys = endpointKeyProcessingTimer.record(() -> {
            Set<EndpointKey> keys = new HashSet<>();
            for (IngestLogRequest.RequestLogRequest requestLogRequest : request.requests()) {
                String pathTemplate = pathTemplateDeriver.derive(requestLogRequest.getPath());
                String method = requestLogRequest.getMethod();
                UUID serviceId = request.serviceId();

                keys.add(new EndpointKey(serviceId, method, pathTemplate));
                requestLogRequest.setPathTemplate(pathTemplate);
            }
            return keys;
        });

        Map<EndpointKey, UUID> endpointIdMapping = endpointUpsertTimer.record(
            () -> endpointService.upsertEndpointsAndReturnIdMapping(endpointKeys)
        );

        endpointMappingTimer.record(() -> {
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
        });
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

    /**
     * Logs throughput and average stage latency approximately once every second.
     * Only one request thread is allowed to perform the logging.
     */
    private void logThroughputIfNeeded() {
        long now = System.nanoTime();
        long lastLogged = lastThroughputLogNanos.get();
        long elapsedNanos = now - lastLogged;

        if (elapsedNanos < THROUGHPUT_LOG_INTERVAL_NANOS) {
            return;
        }

        /* Only one concurrent request wins. */
        if (!lastThroughputLogNanos.compareAndSet(lastLogged, now)) {
            return;
        }

        /* Throughput */
        long currentReceived = totalReceived.get();
        long previousReceived = lastLoggedRequestCount.getAndSet(currentReceived);
        double elapsedSeconds = elapsedNanos / 1_000_000_000.0;
        double requestsPerSecond = (currentReceived - previousReceived) / elapsedSeconds;

        /* Current request state */
        long completed = totalCompleted.get();
        long failed = totalFailed.get();
        long inFlight = currentReceived - completed - failed;

        /* Per-second stage latency */
        double serviceIdentityMs = getIntervalAverageMs(
            resolveServiceIdentityTimer,
            lastResolveServiceIdentityCount,
            lastResolveServiceIdentityTotalNanos
        );
        double apiKeyMs = getIntervalAverageMs(
            apiKeyValidationTimer,
            lastApiKeyValidationCount,
            lastApiKeyValidationTotalNanos
        );
        double endpointKeyProcessingMs = getIntervalAverageMs(
            endpointKeyProcessingTimer,
            lastEndpointKeyProcessingCount,
            lastEndpointKeyProcessingTotalNanos
        );
        double endpointUpsertMs = getIntervalAverageMs(
            endpointUpsertTimer,
            lastEndpointUpsertCount,
            lastEndpointUpsertTotalNanos
        );
        double endpointMappingMs = getIntervalAverageMs(
            endpointMappingTimer,
            lastEndpointMappingCount,
            lastEndpointMappingTotalNanos
        );
        double endpointBulkInsertMs = getIntervalAverageMs(
            endpointBulkInsertTimer,
            lastEndpointBulkInsertCount,
            lastEndpointBulkInsertTotalNanos
        );
        double endpointFindMappingMs = getIntervalAverageMs(
            endpointFindMappingTimer,
            lastEndpointFindMappingCount,
            lastEndpointFindMappingTotalNanos
        );
        double endpointBulkUpdateMs = getIntervalAverageMs(
            endpointBulkUpdateTimer,
            lastEndpointBulkUpdateCount,
            lastEndpointBulkUpdateTotalNanos
        );
        double kafkaMs = getIntervalAverageMs(
            kafkaSendTimer,
            lastKafkaSendCount,
            lastKafkaSendTotalNanos
        );

        log.info(
            "Ingest stats: received={}, completed={}, failed={}, inFlight={}, rate={} req/s | " +
                "serviceIdentity={}ms, apiKey={}ms, endpointKeyProcessing={}ms, endpointUpsert={}ms, " +
                "endpointMapping={}ms, endpointInsert={}ms, endpointFindMapping={}ms, endpointUpdate={}ms, kafka={}ms",
            currentReceived,
            completed,
            failed,
            inFlight,
            Math.round(requestsPerSecond),
            format(serviceIdentityMs),
            format(apiKeyMs),
            format(endpointKeyProcessingMs),
            format(endpointUpsertMs),
            format(endpointMappingMs),
            format(endpointBulkInsertMs),
            format(endpointFindMappingMs),
            format(endpointBulkUpdateMs),
            format(kafkaMs)
        );
    }

    /**
     * Calculates average duration for timer samples recorded since the previous throughput log.
     */
    private double getIntervalAverageMs(
        Timer timer,
        AtomicLong previousCount,
        AtomicLong previousTotalNanos
    ) {
        long currentCount = timer.count();
        long currentTotalNanos = (long) timer.totalTime(TimeUnit.NANOSECONDS);

        long previousCountValue = previousCount.getAndSet(currentCount);
        long previousTotalNanosValue = previousTotalNanos.getAndSet(currentTotalNanos);

        long intervalCount = currentCount - previousCountValue;
        long intervalTotalNanos = currentTotalNanos - previousTotalNanosValue;

        if (intervalCount <= 0) {
            return 0.0;
        }

        return (double) intervalTotalNanos / intervalCount / 1_000_000.0;
    }

    String format(double value) {
        return String.format("%.2f", value);
    }
}
