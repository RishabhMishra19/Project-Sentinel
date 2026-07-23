package com.sentinel.server.common.dto;

import java.time.Instant;
import java.util.List;

public record ApiError(
        Instant timestamp,
        String errorCode,
        String error,
        String message,
        String path,
        List<FieldErrorDetail> fieldErrors) {
}
