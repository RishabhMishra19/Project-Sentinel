package com.sentinel.api.monitor;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
            .requestInterceptor((request, body, execution) -> {
                HttpServletRequest currentRequest =
                    ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
                String auth = currentRequest.getHeader(HttpHeaders.AUTHORIZATION);
                if (auth != null)
                    request.getHeaders().set(HttpHeaders.AUTHORIZATION, auth);
                return execution.execute(request, body);
            })
            .build();
    }
}
