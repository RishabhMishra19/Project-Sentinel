package com.sentinel.loadEngine.engine;

import com.sentinel.common.postgresql.apikey.entity.ServiceApiKey;
import com.sentinel.common.postgresql.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.loadEngine.engine.dto.IngestRequest;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestDataDTO;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLogConfig;
import jakarta.annotation.PostConstruct;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

public class IngestRequestDataGenerator {

    public IngestRequestDataGenerator(LoadTestRunLogConfig runLogConfig, LoadTestDataDTO loadTestDataDTO,
        ServiceApiKeyRepository apiKeyRepository) {
        this.runLogConfig = runLogConfig;
        this.loadTestDataDTO = loadTestDataDTO;
        this.random = new Random();
        this.serviceIdToApiKeyMap = new HashMap<>();
        this.apiKeyRepository = apiKeyRepository;
        this.serviceIdToEndpointListMap = loadTestDataDTO.getServiceIdToEndpointInfoMap();
        this.serviceIds = loadTestDataDTO.getServiceIds();
    }

    private final ServiceApiKeyRepository apiKeyRepository;
    private final LoadTestRunLogConfig runLogConfig;
    private final LoadTestDataDTO loadTestDataDTO;
    private final Random random;
    private final Map<UUID, String> serviceIdToApiKeyMap;
    private final Map<UUID, List<LoadTestDataDTO.EndpointInfo>> serviceIdToEndpointListMap;
    private final List<UUID> serviceIds;

    @PostConstruct
    public void init() {
        System.out.println("Populating serviceIdToApiKeyMap!");
        List<ServiceApiKey> apiKeys = apiKeyRepository.findByServiceIdIn(loadTestDataDTO.getServiceIds());
        for (ServiceApiKey apiKey : apiKeys) {
            this.serviceIdToApiKeyMap.putIfAbsent(apiKey.getServiceId(), apiKey.getKeyHash());
        }
    }

    public IngestRequest getRequest() {
        UUID serviceId = this.serviceIds.get(random.nextInt(serviceIds.size()));
        List<LoadTestDataDTO.EndpointInfo> endpointInfos = serviceIdToEndpointListMap.get(serviceId);
        LoadTestDataDTO.EndpointInfo endpointInfo = endpointInfos.get(random.nextInt(endpointInfos.size()));
        int durationMs = this.getRandomIntBetween(runLogConfig.getMinLatencyMs(), runLogConfig.getMaxLatencyMs());
        int requestSize = this.getRandomIntBetween(10000, 20000);
        int responseSize = this.getRandomIntBetween(10000, 50000);
        Instant occurredAt =
            this.getRandomDateBetween(runLogConfig.getMinRequestOccurredAtTime(), runLogConfig.getMaxRequestOccurredAtTime());
        int statusCode = this.getRandomStatusCode(runLogConfig.getFailureRatePercentage());
        return new IngestRequest(serviceId, serviceIdToApiKeyMap.get(serviceId), List.of(IngestRequest.IngestRequestItem.builder()
            .method(endpointInfo.method())
            .path(endpointInfo.path())
            .occurredAt(occurredAt)
            .statusCode(statusCode)
            .durationMs(durationMs)
            .endUserIp("192.168.1." + random.nextInt(255))
            .requestSizeBytes(requestSize)
            .responseSizeBytes(responseSize)
            .requestId(UUID.randomUUID().toString())
            .traceId(UUID.randomUUID().toString())
            .userId("user_" + random.nextInt(500))
            .build()));
    }

    private Instant getRandomDateBetween(Instant minDate, Instant maxDate) {
        long minDateEpochMilli = minDate.toEpochMilli();
        long maxDateEpochMilli = maxDate.toEpochMilli();
        return Instant.ofEpochMilli(minDateEpochMilli + random.nextLong(maxDateEpochMilli - minDateEpochMilli));
    }

    private int getRandomIntBetween(int minLong, int maxLong) {
        return minLong + random.nextInt(maxLong - minLong);
    }

    private int getRandomStatusCode(double failureRatePercentage) {
        boolean isFailure = (random.nextDouble() * 100.0) < failureRatePercentage;
        return isFailure ? this.getRandomIntBetween(400, 599) : this.getRandomIntBetween(200, 399);
    }


}
