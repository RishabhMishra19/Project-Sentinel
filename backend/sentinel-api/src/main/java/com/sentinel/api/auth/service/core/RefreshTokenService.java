package com.sentinel.api.auth.service.core;

import com.sentinel.api.auth.dto.internal.RefreshTokenIssue;
import com.sentinel.common.postgresql.refreshToken.RefreshToken;
import com.sentinel.common.postgresql.user.User;

import java.util.UUID;

public interface RefreshTokenService {

    RefreshTokenIssue issue(User user);

    RefreshToken validateActive(String rawToken);

    RefreshTokenIssue rotate(String rawToken);

    void revoke(String rawToken);

    void revokeAllForUser(UUID userId);
}
