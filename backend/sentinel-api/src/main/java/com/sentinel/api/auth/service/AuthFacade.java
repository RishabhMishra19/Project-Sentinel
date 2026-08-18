package com.sentinel.api.auth.service;

import com.sentinel.server.auth.dto.internal.AuthSessionResult;
import com.sentinel.server.auth.dto.request.ChangePasswordRequest;
import com.sentinel.server.auth.dto.request.LoginRequest;
import com.sentinel.server.auth.dto.response.ProfileResponse;
import java.util.UUID;

public interface AuthFacade {

    AuthSessionResult login(LoginRequest request);

    AuthSessionResult refresh(String refreshTokenRaw);

    void logout(String refreshTokenRaw);

    ProfileResponse profile(UUID userId);

    AuthSessionResult changePassword(UUID userId, ChangePasswordRequest request);
}
