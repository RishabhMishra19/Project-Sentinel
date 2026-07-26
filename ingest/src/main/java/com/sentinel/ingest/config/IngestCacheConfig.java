package com.sentinel.ingest.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.concurrent.TimeUnit;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class IngestCacheConfig {

    public static final String API_KEY_CACHE = "apiKeyByHash";
    public static final String SERVICE_ACTIVE_CACHE = "serviceActive";
    public static final String INSTANCE_SERVICE_CACHE = "instanceServiceId";

    @Bean
    CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager(
                API_KEY_CACHE, SERVICE_ACTIVE_CACHE, INSTANCE_SERVICE_CACHE);
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(10_000)
                .expireAfterWrite(60, TimeUnit.SECONDS));
        return manager;
    }
}
