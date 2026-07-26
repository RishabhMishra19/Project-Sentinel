package com.sentinel.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.sentinel.server", "com.sentinel.common"})
@EntityScan(basePackages = {"com.sentinel.server", "com.sentinel.common"})
@EnableJpaRepositories(basePackages = {"com.sentinel.server", "com.sentinel.common"})
@ConfigurationPropertiesScan
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }
}
