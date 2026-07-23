package com.sentinel.server.auth.dto;

import java.util.List;

public record RoleSummaryResponse(String id, String name, List<PermissionSummaryResponse> permissions) {
}
