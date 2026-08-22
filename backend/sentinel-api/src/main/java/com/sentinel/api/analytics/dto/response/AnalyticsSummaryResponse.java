package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.dto.response.TotalStatsResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummaryResponse extends TotalStatsResponse {

    public AnalyticsSummaryResponse(TotalStatsResponse totalStatsResponse, Long endpointCount) {
        super(
                totalStatsResponse.getBucket(),
                totalStatsResponse.getScope(),
                totalStatsResponse.getEntityId(),
                totalStatsResponse.getTotalStats()
        );
        this.endpointCount = endpointCount;
    }

    private Long endpointCount;

}
