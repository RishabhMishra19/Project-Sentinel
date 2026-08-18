package com.sentinel.ingest.config;

import tools.jackson.databind.ObjectMapper;
import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.ingest.security.ApiKeyAuthFilter;
import com.sentinel.ingest.support.ServiceActiveChecker;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

@Configuration
public class WebConfig {

    @Bean
    ApiKeyAuthFilter apiKeyAuthFilter(
            ServiceApiKeyRepository serviceApiKeyRepository,
            ServiceActiveChecker serviceActiveChecker,
            CacheManager cacheManager,
            ObjectMapper objectMapper) {
        return new ApiKeyAuthFilter(
                serviceApiKeyRepository, serviceActiveChecker, cacheManager, objectMapper);
    }

    @Bean
    FilterRegistrationBean<ApiKeyAuthFilter> apiKeyAuthFilterRegistration(ApiKeyAuthFilter filter) {
        FilterRegistrationBean<ApiKeyAuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(filter);
        registration.addUrlPatterns("/v1/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}
