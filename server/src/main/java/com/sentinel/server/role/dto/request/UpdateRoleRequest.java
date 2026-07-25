package com.sentinel.server.role.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateRoleRequest(@NotBlank @Size(max = 255) String name) {}
