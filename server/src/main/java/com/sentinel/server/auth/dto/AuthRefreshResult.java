package com.sentinel.server.auth.dto;

/**
 * Internal auth result: access token body plus raw refresh token for the HttpOnly cookie.
 */
public record AuthRefreshResult(TokenResponse tokenResponse, String refreshTokenRaw) {
}
