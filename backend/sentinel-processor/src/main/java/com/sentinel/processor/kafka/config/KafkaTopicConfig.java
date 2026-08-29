package com.sentinel.processor.kafka.config;

import com.sentinel.common.kafka.KafkaTopics;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@RequiredArgsConstructor
public class KafkaTopicConfig {

    @Value("${spring.kafka.topic.partitions:1}")
    private int defaultPartitions;

    @Value("${spring.kafka.topic.replication-factor:1}")
    private short defaultReplicas;

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
            .partitions(defaultPartitions)
            .replicas(defaultReplicas)
            .build();
    }
}
