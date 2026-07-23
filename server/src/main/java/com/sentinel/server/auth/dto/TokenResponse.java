package com.sentinel.server.auth.dto;

public record TokenResponse(String accessToken, long expiresIn) {
}
