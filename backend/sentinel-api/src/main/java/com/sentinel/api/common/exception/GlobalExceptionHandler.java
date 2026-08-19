package com.sentinel.api.common.exception;

import com.sentinel.api.common.dto.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiError> handleApiException(ApiException ex, HttpServletRequest request) {
        ErrorCode code = ex.getErrorCode();
        return ResponseEntity.status(code.getStatus())
                .body(new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        ex.getMessage(),
                        request.getRequestURI(),
                        null));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleValidation(
            IllegalArgumentException ex, HttpServletRequest request) {
        ErrorCode code = ErrorCode.ILLEGAL_ARGUMENT;
        return ResponseEntity.status(code.getStatus())
                .body(new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        ex.getMessage(),
                        request.getRequestURI(),
                        null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ApiError.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new ApiError.FieldError(err.getField(), err.getDefaultMessage()))
                .toList();
        ErrorCode code = ErrorCode.VALIDATION_FAILED;
        return ResponseEntity.status(code.getStatus())
                .body(new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        "Validation failed",
                        request.getRequestURI(),
                        fieldErrors));
    }

    @ExceptionHandler({BadCredentialsException.class, AuthenticationException.class})
    public ResponseEntity<ApiError> handleAuth(AuthenticationException ex, HttpServletRequest request) {
        ErrorCode code = ErrorCode.UNAUTHORIZED;
        return ResponseEntity.status(code.getStatus())
                .body(new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        "Invalid email or password",
                        request.getRequestURI(),
                        null));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        ErrorCode code = ErrorCode.FORBIDDEN;
        return ResponseEntity.status(code.getStatus())
                .body(new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        "Access denied",
                        request.getRequestURI(),
                        null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error(
                "Unhandled exception: {} {}",
                request.getMethod(),
                request.getRequestURI(),
                ex);
        ErrorCode code = ErrorCode.INTERNAL_ERROR;
        return ResponseEntity.status(code.getStatus())
                .body(new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        "Unexpected error",
                        request.getRequestURI(),
                        null));
    }
}
