package com.sentinel.common.analytics.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AnalyticsScope {
    TENANT("tenant"),
    PRODUCT("product"),
    SERVICE("service"),
    ENDPOINT("endpoint");
    private final String name;
}
