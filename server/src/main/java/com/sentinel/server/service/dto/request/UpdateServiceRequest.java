package com.sentinel.server.service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateServiceRequest(@NotBlank @Size(max = 255) String name) {
}
