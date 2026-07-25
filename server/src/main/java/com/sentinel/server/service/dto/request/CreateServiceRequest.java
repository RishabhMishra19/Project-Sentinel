package com.sentinel.server.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateServiceRequest(@NotBlank @Size(max = 255) String name) {
}
