package com.sentinel.api.auth.dto.internal;

import com.sentinel.server.auth.dto.response.AuthSessionResponse;

/**
 * Internal auth result: API session body plus raw refresh token for the HttpOnly cookie.
 * Raw token is never stored on {@link com.sentinel.server.auth.entity.RefreshToken} (only its hash is).
 */
public record AuthSessionResult(AuthSessionResponse body, String refreshTokenRaw) {
}
