package com.sentinel.server.auth.dto;

import com.sentinel.server.auth.entity.RefreshToken;

/**
 * Newly issued refresh token: raw value for the cookie + persisted entity (hash only).
 */
public record RefreshTokenIssue(String rawToken, RefreshToken entity) {
}
