package com.sentinel.server.auth.service.core;

import com.sentinel.server.auth.dto.RefreshTokenIssue;
import com.sentinel.server.auth.entity.RefreshToken;
import com.sentinel.server.user.entity.User;
import java.util.UUID;

public interface RefreshTokenService {

    RefreshTokenIssue issue(User user);

    RefreshToken validateActive(String rawToken);

    RefreshTokenIssue rotate(String rawToken);

    void revoke(String rawToken);

    void revokeAllForUser(UUID userId);
}
