package com.sentinel.api.product.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProductRequest(@NotBlank @Size(max = 255) String name) {
}
