package com.sentinel.server.auth.controller;

import com.sentinel.server.auth.dto.AuthLoginResult;
import com.sentinel.server.auth.dto.AuthRefreshResult;
import com.sentinel.server.auth.dto.LoginRequest;
import com.sentinel.server.auth.dto.LoginResponse;
import com.sentinel.server.auth.dto.MeResponse;
import com.sentinel.server.auth.dto.TokenResponse;
import com.sentinel.server.auth.service.AuthFacade;
import com.sentinel.server.common.response.ApiResponses;
import com.sentinel.server.security.CookieAuthSupport;
import com.sentinel.server.security.JwtProperties;
import com.sentinel.server.security.UserPrincipal;
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
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthLoginResult result = authFacade.login(request);
        cookieAuthSupport.writeRefreshCookie(
                response, result.refreshTokenRaw(), jwtProperties.getRefreshTokenTtl().toSeconds());
        return ApiResponses.ok(result.loginResponse());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String raw = cookieAuthSupport.readRefreshCookie(request);
        AuthRefreshResult result = authFacade.refresh(raw);
        cookieAuthSupport.writeRefreshCookie(
                response, result.refreshTokenRaw(), jwtProperties.getRefreshTokenTtl().toSeconds());
        return ApiResponses.ok(result.tokenResponse());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String raw = cookieAuthSupport.readRefreshCookie(request);
        authFacade.logout(raw);
        cookieAuthSupport.clearRefreshCookie(response);
        return ApiResponses.noContent();
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponses.ok(authFacade.me(principal.getId()));
    }
}
