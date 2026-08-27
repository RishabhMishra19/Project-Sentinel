package com.sentinel.processor.kafka.config;

import com.sentinel.common.kafka.KafkaProperties;
import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@EnableConfigurationProperties(KafkaProperties.class)
@RequiredArgsConstructor
public class KafkaTopicConfig {

    private final KafkaProperties kafkaProperties;

    @Bean
    public NewTopic requestLogsTopic() {
        return topic(KafkaTopics.request_logs);
    }

    @Bean
    public NewTopic tenantMinuteAnalyticsTopic() {
        return topic(KafkaTopics.tenant_minute_analytics);
    }

    @Bean
    public NewTopic productMinuteAnalyticsTopic() {
        return topic(KafkaTopics.product_minute_analytics);
    }

    @Bean
    public NewTopic serviceMinuteAnalyticsTopic() {
        return topic(KafkaTopics.service_minute_analytics);
    }

    @Bean
    public NewTopic endpointMinuteAnalyticsTopic() {
        return topic(KafkaTopics.endpoint_minute_analytics);
    }

    @Bean
    public NewTopic tenantHourAnalyticsTopic() {
        return topic(KafkaTopics.tenant_hour_analytics);
    }

    @Bean
    public NewTopic productHourAnalyticsTopic() {
        return topic(KafkaTopics.product_hour_analytics);
    }

    @Bean
    public NewTopic serviceHourAnalyticsTopic() {
        return topic(KafkaTopics.service_hour_analytics);
    }

    @Bean
    public NewTopic endpointHourAnalyticsTopic() {
        return topic(KafkaTopics.endpoint_hour_analytics);
    }

    @Bean
    public NewTopic tenantDayAnalyticsTopic() {
        return topic(KafkaTopics.tenant_day_analytics);
    }

    @Bean
    public NewTopic productDayAnalyticsTopic() {
        return topic(KafkaTopics.product_day_analytics);
    }

    @Bean
    public NewTopic serviceDayAnalyticsTopic() {
        return topic(KafkaTopics.service_day_analytics);
    }

    @Bean
    public NewTopic endpointDayAnalyticsTopic() {
        return topic(KafkaTopics.endpoint_day_analytics);
    }

    private NewTopic topic(String name) {
        return TopicBuilder
            .name(name)
            .partitions(kafkaProperties.topic().partitions())
            .replicas(kafkaProperties.topic().replicationFactor())
            .build();
    }
}
