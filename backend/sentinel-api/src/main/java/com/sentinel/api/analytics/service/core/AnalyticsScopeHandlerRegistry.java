package com.sentinel.api.analytics.service.core;

import com.sentinel.server.common.exception.BadRequestException;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsScopeHandlerRegistry {

    private final Map<AnalyticsScope, AnalyticsScopeHandler> handlers;

    public AnalyticsScopeHandlerRegistry(List<AnalyticsScopeHandler> handlerList) {
        Map<AnalyticsScope, AnalyticsScopeHandler> map = new EnumMap<>(AnalyticsScope.class);
        for (AnalyticsScopeHandler handler : handlerList) {
            map.put(handler.scope(), handler);
        }
        this.handlers = Map.copyOf(map);
    }

    public AnalyticsScopeHandler get(AnalyticsScope scope) {
        AnalyticsScopeHandler handler = handlers.get(scope);
        if (handler == null) {
            throw new BadRequestException("Unsupported analytics scope: " + scope);
        }
        return handler;
    }
}
