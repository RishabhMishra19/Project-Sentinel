package com.example.Sentinel.auth.service;

import com.example.Sentinel.auth.dto.request.LoginRequest;
import com.example.Sentinel.auth.dto.request.LogoutRequest;
import com.example.Sentinel.auth.dto.request.RefreshTokenRequest;
import com.example.Sentinel.auth.dto.request.SetPasswordRequest;
import com.example.Sentinel.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse refreshAccessToken(RefreshTokenRequest request);

    void logout(LogoutRequest request);

    AuthResponse setPassword(SetPasswordRequest request);

}
