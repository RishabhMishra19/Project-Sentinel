package com.sentinel.common.kafka;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sentinel.kafka")
public record KafkaProperties(String bootstrapServers) {
}
