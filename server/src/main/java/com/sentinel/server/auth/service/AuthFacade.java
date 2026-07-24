package com.sentinel.server.auth.service;

import com.sentinel.server.auth.dto.AuthLoginResult;
import com.sentinel.server.auth.dto.AuthRefreshResult;
import com.sentinel.server.auth.dto.ChangePasswordRequest;
import com.sentinel.server.auth.dto.LoginRequest;
import com.sentinel.server.auth.dto.MeResponse;
import java.util.UUID;

public interface AuthFacade {

    AuthLoginResult login(LoginRequest request);

    AuthRefreshResult refresh(String refreshTokenRaw);

    void logout(String refreshTokenRaw);

    MeResponse me(UUID userId);

    AuthRefreshResult changePassword(UUID userId, ChangePasswordRequest request);
}
