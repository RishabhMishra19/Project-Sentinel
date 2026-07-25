package com.sentinel.server.user.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record AssignRoleRequest(@NotNull UUID roleId) {}
