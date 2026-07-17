package com.example.Sentinel.common.exceptions;

import com.example.Sentinel.common.constants.CommonErrorCodes;
import com.example.Sentinel.common.response.ApiErrorResponse;
import com.example.Sentinel.common.response.FieldErrorResponse;
import com.example.Sentinel.common.response.ResponseBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException ex) {
        return ResponseBuilder.error(ex.getHttpStatus(), ex.getErrorCode(), ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {

        ex.printStackTrace();

        List<FieldErrorResponse> errors = ex
                .getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> FieldErrorResponse
                        .builder()
                        .field(error.getField())
                        .message(error.getDefaultMessage())
                        .build())
                .toList();

        return ResponseBuilder.error(HttpStatus.BAD_REQUEST,
                                     CommonErrorCodes.VALIDATION_ERROR,
                                     "Validation failed",
                                     errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(Exception ex) {
        return ResponseBuilder.error(HttpStatus.INTERNAL_SERVER_ERROR,
                                     CommonErrorCodes.INTERNAL_SERVER_ERROR,
                                     "Something went wrong. Please try again later.");
    }
    @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(Exception ex) {
        return ResponseBuilder.error(
                HttpStatus.UNAUTHORIZED,
                "AUTH_001",
                "Invalid email or password."
        );
    }
}