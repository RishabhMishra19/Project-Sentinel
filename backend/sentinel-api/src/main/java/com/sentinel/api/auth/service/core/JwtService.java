package com.sentinel.api.auth.service.core;

import com.sentinel.common.postgresql.user.entity.User;

import java.util.UUID;

public interface JwtService {

    String createAccessToken(User user);

    UUID parseUserId(String token);

    long getAccessTokenTtlSeconds();
}
