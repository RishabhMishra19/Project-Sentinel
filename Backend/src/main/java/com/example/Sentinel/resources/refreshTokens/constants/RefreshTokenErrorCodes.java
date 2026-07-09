package com.example.Sentinel.resources.refreshTokens.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class RefreshTokenErrorCodes {
    public static final String REFRESH_TOKEN_NOT_FOUND = "RTEC_001";
    public static final String REFRESH_TOKEN_REVOKED = "RTEC_002";
    public static final String REFRESH_TOKEN_EXPIRED = "RTEC_003";

}
