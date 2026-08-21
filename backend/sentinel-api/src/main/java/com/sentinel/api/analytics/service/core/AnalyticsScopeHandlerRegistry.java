package com.sentinel.api.analytics.service.core;

import com.sentinel.api.common.exception.BadRequestException;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsScopeHandlerRegistry {

    private final Map<com.sentinel.common.analytics.AnalyticsScope, AnalyticsScopeHandler> handlers;

    public AnalyticsScopeHandlerRegistry(List<AnalyticsScopeHandler> handlerList) {
        Map<com.sentinel.common.analytics.AnalyticsScope, AnalyticsScopeHandler> map = new EnumMap<>(
                com.sentinel.common.analytics.AnalyticsScope.class);
        for (AnalyticsScopeHandler handler : handlerList) {
            map.put(handler.scope(), handler);
        }
        this.handlers = Map.copyOf(map);
    }

    public AnalyticsScopeHandler get(com.sentinel.common.analytics.AnalyticsScope scope) {
        AnalyticsScopeHandler handler = handlers.get(scope);
        if (handler == null) {
            throw new BadRequestException("Unsupported analytics scope: " + scope);
        }
        return handler;
    }
}
