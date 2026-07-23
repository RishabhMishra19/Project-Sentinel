package com.sentinel.server.auth.service;

import com.sentinel.server.auth.dto.AuthLoginResult;
import com.sentinel.server.auth.dto.AuthRefreshResult;
import com.sentinel.server.auth.dto.LoginRequest;
import com.sentinel.server.auth.dto.LoginResponse;
import com.sentinel.server.auth.dto.MeResponse;
import com.sentinel.server.auth.dto.RefreshTokenIssue;
import com.sentinel.server.auth.dto.TokenResponse;
import com.sentinel.server.auth.mapper.AuthMapper;
import com.sentinel.server.auth.service.core.JwtService;
import com.sentinel.server.auth.service.core.RefreshTokenService;
import com.sentinel.server.common.exception.UnauthorizedException;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.service.core.UserService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthFacadeImpl implements AuthFacade {

    private final UserService userService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper;

    @Override
    public AuthLoginResult login(LoginRequest request) {
        User user = userService.findActiveByEmailWithAuthorities(request.email());
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        String accessToken = jwtService.createAccessToken(user);
        RefreshTokenIssue refresh = refreshTokenService.issue(user);
        LoginResponse response = new LoginResponse(
                accessToken, jwtService.getAccessTokenTtlSeconds(), authMapper.toUserSummary(user));
        return new AuthLoginResult(response, refresh.rawToken());
    }

    @Override
    public AuthRefreshResult refresh(String refreshTokenRaw) {
        if (refreshTokenRaw == null || refreshTokenRaw.isBlank()) {
            throw new UnauthorizedException("Missing refresh token");
        }
        RefreshTokenIssue rotated = refreshTokenService.rotate(refreshTokenRaw);
        User user = userService.findByIdWithAuthorities(rotated.entity().getUser().getId());
        String accessToken = jwtService.createAccessToken(user);
        return new AuthRefreshResult(
                new TokenResponse(accessToken, jwtService.getAccessTokenTtlSeconds()), rotated.rawToken());
    }

    @Override
    public void logout(String refreshTokenRaw) {
        if (refreshTokenRaw != null && !refreshTokenRaw.isBlank()) {
            refreshTokenService.revoke(refreshTokenRaw);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public MeResponse me(UUID userId) {
        User user = userService.findByIdWithAuthorities(userId);
        return authMapper.toMeResponse(user);
    }
}
