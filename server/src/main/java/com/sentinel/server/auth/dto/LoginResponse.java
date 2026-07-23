package com.sentinel.server.auth.dto;

public record LoginResponse(String accessToken, long expiresIn, UserSummaryResponse user) {
}
