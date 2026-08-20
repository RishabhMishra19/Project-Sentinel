package com.sentinel.ingest.logs.dto.request;

import com.sentinel.common.kafka.KafkaMessage;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record IngestLogRequest(@NotNull UUID serviceId, @NotEmpty String apiKey, @NotEmpty @Size(max = 500)List<@Valid RequestLogRequest> requests) {
    @Setter
    @Getter
    @NoArgsConstructor
    public static class RequestLogRequest {
        @NotBlank
        @Size(max = 16)
        String method;

        @NotBlank
        @Size(max = 2048)
        String path;

        @NotNull
        Instant occurredAt;

        @NotNull
        @Min(100)
        @Max(599)
        Integer statusCode;

        @NotNull
        @Min(0)
        Integer durationMs;

        @NotBlank
        @Size(max = 64)
        String endUserIp;

        @NotNull
        @Min(0)
        Integer requestSizeBytes;

        @NotNull
        @Min(0)
        Integer responseSizeBytes;

        @Size(max = 128)
        String requestId;

        @Size(max = 128)
        String traceId;

        @Size(max = 128)
        String userId;

        String pathTemplate; // this field I will fill

        UUID endpointId;  // this field I will fill
    }

    public List<KafkaMessage.ReqLog> toReqLogKafkaMessage(ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity) {
        return this.requests.stream().map(log->
                  KafkaMessage.ReqLog
                      .builder()
                      .requestLogId(UUID.randomUUID())
                      .tenantId(serviceIdentity.tenantId())
                      .productId(serviceIdentity.productId())
                      .serviceId(serviceId)
                      .endpointId(log.endpointId)
                      .path(log.path)
                      .occurredAt(log.occurredAt)
                      .statusCode(log.statusCode)
                      .durationMs(log.durationMs)
                      .endUserIp(log.endUserIp)
                      .requestSizeBytes(log.requestSizeBytes)
                      .responseSizeBytes(log.responseSizeBytes)
                      .requestId(log.requestId)
                      .traceId(log.traceId)
                      .userId(log.userId)
                      .build()
        ).toList();
    }
}
