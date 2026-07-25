package com.sentinel.server.tenant.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateTenantRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank
                @Size(max = 100)
                @Pattern(
                        regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                        message = "must be lowercase letters, digits, and hyphens")
                String slug) {
}
