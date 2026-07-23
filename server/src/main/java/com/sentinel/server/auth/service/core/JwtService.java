package com.sentinel.server.auth.service.core;

import com.sentinel.server.user.entity.User;
import java.util.UUID;

public interface JwtService {

    String createAccessToken(User user);

    UUID parseUserId(String token);

    long getAccessTokenTtlSeconds();
}
