package com.sentinel.api.auth.dto.internal;

import com.sentinel.common.postgresql.refreshToken.RefreshToken;

/**
 * Newly issued refresh token: raw value for the cookie + persisted entity (hash only).
 */
public record RefreshTokenIssue(String rawToken, RefreshToken entity) {
}
