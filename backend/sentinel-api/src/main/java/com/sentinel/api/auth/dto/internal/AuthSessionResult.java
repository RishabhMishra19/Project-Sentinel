package com.sentinel.api.auth.dto.internal;

import com.sentinel.api.auth.dto.response.AuthSessionResponse;
import com.sentinel.common.postgresql.refreshToken.RefreshToken;

/**
 * Internal auth result: API session body plus raw refresh token for the HttpOnly cookie. Raw token is never stored on
 * {@link RefreshToken} (only its hash is).
 */
public record AuthSessionResult(AuthSessionResponse body, String refreshTokenRaw) {
}
