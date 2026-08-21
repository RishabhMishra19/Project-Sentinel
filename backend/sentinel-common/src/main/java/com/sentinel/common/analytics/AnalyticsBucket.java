package com.sentinel.common.analytics;

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
