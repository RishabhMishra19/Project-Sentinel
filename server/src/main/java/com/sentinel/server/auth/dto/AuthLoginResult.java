package com.sentinel.server.auth.dto;

/**
 * Internal auth result: API login body plus raw refresh token for the HttpOnly cookie.
 * Raw token is never stored on {@link com.sentinel.server.auth.entity.RefreshToken} (only its hash is).
 */
public record AuthLoginResult(LoginResponse loginResponse, String refreshTokenRaw) {
}
