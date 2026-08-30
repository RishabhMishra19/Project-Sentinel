package com.sentinel.processor.monitor;

import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.streams.KafkaStreamsMicrometerListener;

@Configuration
public class KafkaStreamsMetricsConfig {

    @Bean
    public KafkaStreamsMicrometerListener kafkaStreamsMicrometerListener(MeterRegistry meterRegistry) {
        return new KafkaStreamsMicrometerListener(meterRegistry);
    }
}
