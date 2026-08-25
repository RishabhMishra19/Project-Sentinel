package com.sentinel.api.auth.service.core;

import com.sentinel.api.user.entity.User;

import java.util.UUID;

public interface JwtService {

    String createAccessToken(User user);

    UUID parseUserId(String token);

    long getAccessTokenTtlSeconds();
}
