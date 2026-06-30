package com.example.Sentinel.common.exceptions;

import org.springframework.http.HttpStatus;

public class ConflictException extends BusinessException {

    public ConflictException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.CONFLICT);
    }

}
