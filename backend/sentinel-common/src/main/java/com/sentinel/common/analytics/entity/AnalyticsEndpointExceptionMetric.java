package com.sentinel.common.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "analytics_endpoint_exception_metrics")
@IdClass(AnalyticsEndpointExceptionMetric.Pk.class)
@Getter
@Setter
@NoArgsConstructor
public class AnalyticsEndpointExceptionMetric {

    @Id
    @Column(name = "bucket_start", nullable = false)
    private Instant bucketStart;

    @Id
    @Column(name = "endpoint_id", nullable = false)
    private UUID endpointId;

    @Id
    @Column(name = "exception_type", nullable = false, length = 256)
    private String exceptionType;

    @Column(name = "exception_count", nullable = false)
    private long exceptionCount;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Pk implements Serializable {
        private Instant bucketStart;
        private UUID endpointId;
        private String exceptionType;

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (!(o instanceof Pk that)) {
                return false;
            }
            return Objects.equals(bucketStart, that.bucketStart)
                    && Objects.equals(endpointId, that.endpointId)
                    && Objects.equals(exceptionType, that.exceptionType);
        }

        @Override
        public int hashCode() {
            return Objects.hash(bucketStart, endpointId, exceptionType);
        }
    }
}
