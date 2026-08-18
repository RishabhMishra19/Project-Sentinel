package com.sentinel.processor.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class WorkerCacheConfig {

    public static final String SERVICE_HIERARCHY_CACHE = "serviceHierarchy";
    public static final String ENDPOINT_CACHE = "endpoints";

    @Bean
    CacheManager cacheManager() {
        CaffeineCacheManager manager =
                new CaffeineCacheManager(SERVICE_HIERARCHY_CACHE, ENDPOINT_CACHE);
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(100_000)
                .expireAfterWrite(1, TimeUnit.HOURS));
        return manager;
    }
}
