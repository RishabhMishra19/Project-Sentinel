package com.sentinel.api.auth.service;

import com.sentinel.api.auth.dto.internal.AuthSessionResult;
import com.sentinel.api.auth.dto.request.ChangePasswordRequest;
import com.sentinel.api.auth.dto.request.LoginRequest;
import com.sentinel.api.auth.dto.response.ProfileResponse;
import java.util.UUID;

public interface AuthFacade {

    AuthSessionResult login(LoginRequest request);

    AuthSessionResult refresh(String refreshTokenRaw);

    void logout(String refreshTokenRaw);

    ProfileResponse profile(UUID userId);

    AuthSessionResult changePassword(UUID userId, ChangePasswordRequest request);
}
