package com.sentinel.api.auth.controller;

import com.sentinel.api.auth.dto.response.AuthSessionResponse;
import com.sentinel.api.auth.dto.internal.AuthSessionResult;
import com.sentinel.api.auth.dto.request.ChangePasswordRequest;
import com.sentinel.api.auth.dto.request.LoginRequest;
import com.sentinel.api.auth.dto.response.ProfileResponse;
import com.sentinel.api.auth.service.AuthFacade;
import com.sentinel.api.common.response.ApiResponses;
import com.sentinel.api.security.CookieAuthSupport;
import com.sentinel.api.security.JwtProperties;
import com.sentinel.api.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthFacade authFacade;
    private final CookieAuthSupport cookieAuthSupport;
    private final JwtProperties jwtProperties;

    @PostMapping("/login")
    public ResponseEntity<AuthSessionResponse> login(
            @Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthSessionResult result = authFacade.login(request);
        writeRefreshCookie(response, result.refreshTokenRaw());
        return ApiResponses.ok(result.body());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthSessionResponse> refreshToken(
            HttpServletRequest request, HttpServletResponse response) {
        String raw = cookieAuthSupport.readRefreshCookie(request);
        AuthSessionResult result = authFacade.refresh(raw);
        writeRefreshCookie(response, result.refreshTokenRaw());
        return ApiResponses.ok(result.body());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String raw = cookieAuthSupport.readRefreshCookie(request);
        authFacade.logout(raw);
        cookieAuthSupport.clearRefreshCookie(response);
        return ApiResponses.noContent();
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> profile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(authFacade.profile(principal.getId()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthSessionResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletResponse response) {
        AuthSessionResult result = authFacade.changePassword(principal.getId(), request);
        writeRefreshCookie(response, result.refreshTokenRaw());
        return ApiResponses.ok(result.body());
    }

    private void writeRefreshCookie(HttpServletResponse response, String refreshTokenRaw) {
        cookieAuthSupport.writeRefreshCookie(
                response, refreshTokenRaw, jwtProperties.getRefreshTokenTtl().toSeconds());
    }
}
