package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.cassandra.analytics.dto.response.TimeSeriesStatsResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsTimeSeriesResponse extends TimeSeriesStatsResponse {

    private Long endpointCount;
    private String entityName;
    public AnalyticsTimeSeriesResponse(
        TimeSeriesStatsResponse timeSeriesStatsResponse,
        Long endpointCount,
        String entityName
    ) {
        super(
            timeSeriesStatsResponse.getBucket(),
            timeSeriesStatsResponse.getScope(),
            timeSeriesStatsResponse.getEntityId(),
            timeSeriesStatsResponse.getTimeSeriesStats()
        );
        this.endpointCount = endpointCount;
        this.entityName = entityName;
    }

}
