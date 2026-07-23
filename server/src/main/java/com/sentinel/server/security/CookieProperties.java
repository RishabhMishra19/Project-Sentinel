package com.sentinel.server.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "sentinel.cookie")
@Getter
@Setter
public class CookieProperties {

    private String refreshTokenName = "refresh_token";
    private String path = "/api/auth";
    private boolean secure = false;
    private String sameSite = "Lax";
}
