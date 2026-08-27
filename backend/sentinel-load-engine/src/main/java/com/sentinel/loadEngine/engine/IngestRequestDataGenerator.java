package com.sentinel.loadEngine.engine;

import com.sentinel.loadEngine.engine.dto.IngestRequest;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestDataDTO;
import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLogConfig;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

public class IngestRequestDataGenerator {

    public IngestRequestDataGenerator(LoadTestRunLogConfig runLogConfig, LoadTestDataDTO loadTestDataDTO) {
        this.runLogConfig = runLogConfig;
        this.loadTestDataDTO = loadTestDataDTO;
        this.serviceIdToEndpointListMap = loadTestDataDTO.getServiceIdToEndpointInfoMap();
        this.serviceIds = loadTestDataDTO.getServiceIds();
        this.lastOccurredAt = runLogConfig.getMinRequestOccurredAtTime() != null
            ? runLogConfig.getMinRequestOccurredAtTime()
            : Instant.now();

        this.minOccurredAtEpochMilli = this.lastOccurredAt.toEpochMilli();
        this.maxOccurredAtEpochMilli = runLogConfig.getMaxRequestOccurredAtTime().toEpochMilli();
        this.totalRequests = (long) runLogConfig.getDurationSeconds() * runLogConfig.getTargetRps();
        this.timeRangeMs = maxOccurredAtEpochMilli - minOccurredAtEpochMilli;
    }

    private final LoadTestRunLogConfig runLogConfig;
    private final LoadTestDataDTO loadTestDataDTO;
    private final Map<UUID, List<LoadTestDataDTO.EndpointInfo>> serviceIdToEndpointListMap;
    private final List<UUID> serviceIds;
    private final long minOccurredAtEpochMilli;
    private final long maxOccurredAtEpochMilli;
    private final long totalRequests;
    private final long timeRangeMs;
    private Instant lastOccurredAt;
    private long generatedRequests;

    public IngestRequest getRequest() {
        UUID serviceId = this.serviceIds.get(ThreadLocalRandom.current().nextInt(serviceIds.size()));
        List<LoadTestDataDTO.EndpointInfo> endpointInfos = serviceIdToEndpointListMap.get(serviceId);
        LoadTestDataDTO.EndpointInfo endpointInfo = endpointInfos.get(ThreadLocalRandom.current().nextInt(endpointInfos.size()));
        int durationMs = this.getRandomIntBetween(runLogConfig.getMinLatencyMs(), runLogConfig.getMaxLatencyMs());
        int requestSize = this.getRandomIntBetween(10000, 20000);
        int responseSize = this.getRandomIntBetween(10000, 50000);
        Instant occurredAt = this.getNextOccurredAt();
        int statusCode = this.getRandomStatusCode(runLogConfig.getFailureRatePercentage());
        return new IngestRequest(serviceId, this.loadTestDataDTO.getApiKeysMap().get(serviceId),
            List.of(IngestRequest.IngestRequestItem.builder()
                .method(endpointInfo.method())
                .path(endpointInfo.path())
                .occurredAt(occurredAt)
                .statusCode(statusCode)
                .durationMs(durationMs)
                .endUserIp("192.168.1." + ThreadLocalRandom.current().nextInt(255))
                .requestSizeBytes(requestSize)
                .responseSizeBytes(responseSize)
                .requestId(UUID.randomUUID().toString())
                .traceId(UUID.randomUUID().toString())
                .userId("user_" + ThreadLocalRandom.current().nextInt(500))
                .build()));
    }

    private int getRandomIntBetween(int minLong, int maxLong) {
        return minLong + ThreadLocalRandom.current().nextInt(maxLong - minLong);
    }

    public synchronized Instant getNextOccurredAt() {
        if (totalRequests <= 1 || timeRangeMs <= 0) {
            lastOccurredAt = Instant.ofEpochMilli(
                Math.min(lastOccurredAt.toEpochMilli() + 1, maxOccurredAtEpochMilli)
            );
            return lastOccurredAt;
        }

        long requestNumber = generatedRequests++;

        long nextEpochMilli = minOccurredAtEpochMilli
            + (requestNumber * timeRangeMs / (totalRequests - 1));

        if (nextEpochMilli <= lastOccurredAt.toEpochMilli()) {
            nextEpochMilli = lastOccurredAt.toEpochMilli() + 1;
        }

        if (nextEpochMilli > maxOccurredAtEpochMilli) {
            nextEpochMilli = maxOccurredAtEpochMilli;
        }

        lastOccurredAt = Instant.ofEpochMilli(nextEpochMilli);

        return lastOccurredAt;
    }

    private int getRandomStatusCode(double failureRatePercentage) {
        boolean isFailure = (ThreadLocalRandom.current().nextDouble() * 100.0) < failureRatePercentage;
        return isFailure ? this.getRandomIntBetween(400, 599) : this.getRandomIntBetween(200, 399);
    }


}
