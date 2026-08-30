package com.sentinel.api.monitor.dto;

public record KafkaStreamDefinition(String name, String sourceNode, String sourceTopic, String sinkNode, String sinkTopic) {
}
