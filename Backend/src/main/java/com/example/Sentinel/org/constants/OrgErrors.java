package com.example.Sentinel.org.constants;

import lombok.Getter;

@Getter
public enum OrgErrors {
    ORG_NOT_FOUND("ORG_001", "Org Not Found"),
    INVALID_NEW_OWNER_FOR_ORG("ORG_002", "New provided owner is invalid"),
    ORG_WITH_NAME_ALREADY_EXISTS("ORG_003", "Org with provided name already exists");

    private final String errorCode;
    private final String errorMessage;

    OrgErrors(String errorCode, String errorMessage){
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

}
