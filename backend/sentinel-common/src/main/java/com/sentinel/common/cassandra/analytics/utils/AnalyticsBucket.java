package com.sentinel.common.cassandra.analytics.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AnalyticsBucket {
    MINUTE("minute"),
    HOUR("hour"),
    DAY("day");
    private final String name;
}
