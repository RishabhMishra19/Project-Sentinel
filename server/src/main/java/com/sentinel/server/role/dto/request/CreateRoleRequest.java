package com.sentinel.server.role.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRoleRequest(@NotBlank @Size(max = 255) String name) {}
