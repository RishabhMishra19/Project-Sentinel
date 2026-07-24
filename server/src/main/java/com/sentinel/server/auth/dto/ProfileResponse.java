package com.sentinel.server.auth.dto;

import java.util.List;

public record ProfileResponse(UserProfileResponse user, List<RoleSummaryResponse> roles) {
}
