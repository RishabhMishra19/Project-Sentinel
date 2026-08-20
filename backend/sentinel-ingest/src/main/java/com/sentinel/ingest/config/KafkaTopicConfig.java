package com.sentinel.ingest.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    NewTopic requestEventsTopic(
            @Value("${sentinel.kafka.request-logs-topic}") String topic,
            @Value("${sentinel.kafka.request-logs-partitions}") int partitions,
            @Value("${sentinel.kafka.request-logs-replicas}") short replicas) {
        return TopicBuilder.name(topic).partitions(partitions).replicas(replicas).build();
    }

}
