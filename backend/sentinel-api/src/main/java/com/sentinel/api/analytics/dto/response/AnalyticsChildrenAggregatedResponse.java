package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.cassandra.analytics.dto.response.EntityAggregatedStatsResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnalyticsChildrenAggregatedResponse extends EntityAggregatedStatsResponse {

    private Map<UUID, Long> endpointCountMap;
    private Map<UUID, String> idToNameMap;
    public AnalyticsChildrenAggregatedResponse(
        EntityAggregatedStatsResponse entityAggregatedStatsResponse,
        Map<UUID, Long> endpointCountMap,
        Map<UUID, String> idToNameMap
    ) {
        super(
            entityAggregatedStatsResponse.getBucket(),
            entityAggregatedStatsResponse.getScope(),
            entityAggregatedStatsResponse.getEntityIds(),
            entityAggregatedStatsResponse.getEntityAggregatedStats()
        );
        this.endpointCountMap = endpointCountMap;
        this.idToNameMap = idToNameMap;
    }

}
