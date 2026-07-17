package com.example.Sentinel.auth.controller;

import com.example.Sentinel.auth.dto.request.ChangePasswordRequest;
import com.example.Sentinel.auth.dto.request.LoginRequest;
import com.example.Sentinel.auth.dto.request.LogoutRequest;
import com.example.Sentinel.auth.dto.request.RefreshTokenRequest;
import com.example.Sentinel.auth.dto.request.SetPasswordRequest;
import com.example.Sentinel.auth.dto.response.AuthResponse;
import com.example.Sentinel.auth.dto.response.CurrentUserResponse;
import com.example.Sentinel.auth.service.AuthService;
import com.example.Sentinel.common.response.ApiSuccessResponse;
import com.example.Sentinel.common.response.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> login(
            @RequestBody LoginRequest request
    ) {
        return ResponseBuilder.ok("logged in", authService.login(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> refresh(
            @RequestBody RefreshTokenRequest request
    ) {
        return ResponseBuilder.ok("token refreshed", authService.refreshAccessToken(request));
    }

    @PostMapping("/set-password")
    public ResponseEntity<ApiSuccessResponse<AuthResponse>> setPassword(
            @RequestBody SetPasswordRequest request
    ) {
        return ResponseBuilder.ok("password is updated", authService.setPassword(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiSuccessResponse<Void>> logout(
            @RequestBody LogoutRequest request
    ) {
        authService.logout(request);
        return ResponseBuilder.ok("logged out");
    }

    @PostMapping("/me")
    public ResponseEntity<ApiSuccessResponse<CurrentUserResponse>> me() {
        return ResponseBuilder.ok("logged out", authService.getLoggedInUser());
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiSuccessResponse<Void>> changePassword(
            @RequestBody ChangePasswordRequest request
    ) {
        authService.changePassword(request);
        return ResponseBuilder.ok("password changed");
    }

}
