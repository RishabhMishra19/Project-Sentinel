package com.sentinel.api.analytics.dto.response;

import com.sentinel.common.analytics.dto.response.EntityAggregatedStatsResponse;
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
public class AnalyticsEntityAggregatedResponse extends EntityAggregatedStatsResponse {

    public AnalyticsEntityAggregatedResponse(
            EntityAggregatedStatsResponse entityAggregatedStatsResponse,
            Map<UUID, Long> endpointCountMap
    ) {
        super(
                entityAggregatedStatsResponse.getBucket(),
                entityAggregatedStatsResponse.getScope(),
                entityAggregatedStatsResponse.getEntityIds(),
                entityAggregatedStatsResponse.getEntityAggregatedStats()
        );
        this.endpointCountMap = endpointCountMap;
    }

    private Map<UUID, Long> endpointCountMap;

}
