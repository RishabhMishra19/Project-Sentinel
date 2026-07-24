package com.sentinel.server.auth.dto;

public record RoleScopeSummaryResponse(
        String id, String scopeType, String scopeId, String permission) {
}
