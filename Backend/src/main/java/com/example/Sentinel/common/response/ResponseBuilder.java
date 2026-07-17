package com.example.Sentinel.common.response;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;

public final class ResponseBuilder {

    private ResponseBuilder() {}

    public static <T> ResponseEntity<ApiSuccessResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(buildSuccess(message, data));
    }

    public static ResponseEntity<ApiSuccessResponse<Void>> ok(String message) {
        return ResponseEntity.ok(buildSuccess(message, null));
    }

    public static <T> ResponseEntity<ApiSuccessResponse<T>> created(String message, T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(buildSuccess(message, data));
    }

    public static ResponseEntity<ApiSuccessResponse<Void>> created(String message) {
        return ResponseEntity.status(HttpStatus.CREATED).body(buildSuccess(message, null));
    }

    public static <T> ResponseEntity<ApiSuccessResponse<PageResult<T>>> ok(String message, Page<T> page) {
        return ResponseEntity.ok(buildSuccess(message, PageResult.from(page)));
    }

    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static ResponseEntity<ApiErrorResponse> error(HttpStatus status, String errorCode, String message) {
        return error(status, errorCode, message, null);
    }

    public static ResponseEntity<ApiErrorResponse> error(HttpStatus status, String errorCode, String message, List<FieldErrorResponse> errors) {
        return ResponseEntity.status(status).body(buildError(errorCode, message, errors));
    }

    private static <T> ApiSuccessResponse<T> buildSuccess(String message, T data) {
        return ApiSuccessResponse.<T>builder().message(message).data(data).timestamp(Instant.now()).build();
    }

    private static ApiErrorResponse buildError(String errorCode, String message, List<FieldErrorResponse> errors) {
        return ApiErrorResponse
                .builder()
                .errorCode(errorCode)
                .message(message)
                .errors(errors)
                .timestamp(Instant.now())
                .build();
    }
}