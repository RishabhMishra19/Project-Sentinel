package com.sentinel.ingest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.sentinel.ingest", "com.sentinel.common"})
@EntityScan(basePackages = {"com.sentinel.ingest", "com.sentinel.common"})
@EnableJpaRepositories(basePackages = {"com.sentinel.ingest", "com.sentinel.common"})
@EnableScheduling
public class IngestApplication {

    public static void main(String[] args) {
        SpringApplication.run(IngestApplication.class, args);
    }
}
