package com.sentinel.loadEngine;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.sentinel.loadEngine", "com.sentinel.common"})
@EntityScan(basePackages = {"com.sentinel.loadEngine", "com.sentinel.common"})
@EnableJpaRepositories(basePackages = {"com.sentinel.loadEngine", "com.sentinel.common"})
@EnableCassandraRepositories(basePackages = {"com.sentinel.loadEngine", "com.sentinel.common"})
@ConfigurationPropertiesScan(basePackages = {"com.sentinel.loadEngine", "com.sentinel.common"})
public class LoadEngineApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoadEngineApplication.class, args);
    }
}
