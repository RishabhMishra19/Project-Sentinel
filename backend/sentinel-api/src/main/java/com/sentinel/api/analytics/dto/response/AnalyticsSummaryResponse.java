package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.cassandra.analytics.dto.response.TotalStatsResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsSummaryResponse extends TotalStatsResponse {

    public AnalyticsSummaryResponse(TotalStatsResponse totalStatsResponse, Long endpointCount, String entityName) {
        super(
                totalStatsResponse.getBucket(),
                totalStatsResponse.getScope(),
                totalStatsResponse.getEntityId(),
                totalStatsResponse.getTotalStats()
        );
        this.endpointCount = endpointCount;
        this.entityName = entityName;
    }

    private Long endpointCount;
    private String entityName;

}
