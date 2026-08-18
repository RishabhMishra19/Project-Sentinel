package com.sentinel.api.common.exception;

public class AccessTokenExpiredException extends ApiException {

    public AccessTokenExpiredException() {
        super(ErrorCode.ACCESS_TOKEN_EXPIRED, "Invalid or expired access token");
    }
}
