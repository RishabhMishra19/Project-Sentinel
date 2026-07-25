package com.sentinel.server.product.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(@NotBlank @Size(max = 255) String name) {
}
