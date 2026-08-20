package com.sentinel.processor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.sentinel.processor", "com.sentinel.common"})
@EntityScan(basePackages = {"com.sentinel.processor", "com.sentinel.common"})
@EnableJpaRepositories(basePackages = {"com.sentinel.processor", "com.sentinel.common"})
@EnableScheduling
public class ProcessorApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProcessorApplication.class, args);
    }
}
