package com.sentinel.server.auth.dto;

import java.util.List;

public record MeResponse(UserSummaryResponse user, List<RoleSummaryResponse> roles) {
}
