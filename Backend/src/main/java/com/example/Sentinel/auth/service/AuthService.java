package com.example.Sentinel.auth.service;

import com.example.Sentinel.auth.dto.request.CreateAccountRequest;
import com.example.Sentinel.auth.dto.request.LoginRequest;
import com.example.Sentinel.auth.dto.request.RefreshAccessTokenRequest;
import com.example.Sentinel.auth.dto.request.SetPasswordRequest;
import com.example.Sentinel.auth.dto.response.CreateAccountResponse;
import com.example.Sentinel.auth.dto.response.LoginResponse;
import com.example.Sentinel.auth.dto.response.RefreshAccessTokenResponse;

public interface AuthService {

    CreateAccountResponse createAccount(CreateAccountRequest request);

    LoginResponse login(LoginRequest request);

    void setPassword(SetPasswordRequest request);

    RefreshAccessTokenResponse refreshAccessToken(RefreshAccessTokenRequest request);

    void logout();

}
