package com.example.Sentinel.user.constants;

import lombok.Getter;

@Getter
public enum UserErrors {
    USER_NOT_FOUND("USR_001", "User not found"),
    ORG_OWNER_NOT_FOUND("USR_002", "Org owner not found");

    private final String errorCode;
    private final String errorResponse;

    UserErrors(String errorCode, String errorResponse){
        this.errorCode = errorCode;
        this.errorResponse = errorResponse;
    }

}
