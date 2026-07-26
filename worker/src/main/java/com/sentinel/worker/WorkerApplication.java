package com.sentinel.worker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.sentinel.worker", "com.sentinel.common"})
@EntityScan(basePackages = {"com.sentinel.worker", "com.sentinel.common"})
@EnableJpaRepositories(basePackages = {"com.sentinel.worker", "com.sentinel.common"})
public class WorkerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkerApplication.class, args);
    }
}
