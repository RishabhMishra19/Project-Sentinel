package com.sentinel.api.monitor;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sentinel.monitor")
public record SystemMonitorProperties(
    String serverUrl, String ingestUrl, String processorUrl
) {
}
