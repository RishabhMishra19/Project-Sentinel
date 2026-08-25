package com.sentinel.api.monitor;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sentinel.kafka")
public record KafkaMonitorProperties(String bootstrapServers) {
}
