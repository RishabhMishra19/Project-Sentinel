package com.example.Sentinel.common.exceptions;

import org.springframework.http.HttpStatus;

public class InternalServerException extends BusinessException {

    public InternalServerException(String errorCode, String message) {
        super(errorCode, message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
