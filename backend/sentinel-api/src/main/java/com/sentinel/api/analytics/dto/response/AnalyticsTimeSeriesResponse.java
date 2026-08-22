package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.dto.response.TimeSeriesStatsResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsTimeSeriesResponse extends TimeSeriesStatsResponse {

    public AnalyticsTimeSeriesResponse(TimeSeriesStatsResponse timeSeriesStatsResponse, Long endpointCount) {
        super(
                timeSeriesStatsResponse.getBucket(),
                timeSeriesStatsResponse.getScope(),
                timeSeriesStatsResponse.getEntityId(),
                timeSeriesStatsResponse.getTimeSeriesStats()
        );
        this.endpointCount = endpointCount;
    }

    private Long endpointCount;

}
