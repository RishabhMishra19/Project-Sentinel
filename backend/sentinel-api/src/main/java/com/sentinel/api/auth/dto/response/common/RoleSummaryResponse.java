package com.sentinel.api.auth.dto.response.common;

import java.util.List;

public record RoleSummaryResponse(String id, String name, List<Scope> scopes) {

    public record Scope(String id, String scopeType, String scopeId, String permission) {
    }
}
