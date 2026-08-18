package com.sentinel.api.apikey.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateServiceApiKeyRequest(@NotBlank @Size(max = 255) String name) {
}
