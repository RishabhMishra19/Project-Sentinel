package com.sentinel.api.auth.service;

import com.sentinel.api.auth.dto.internal.AuthSessionResult;
import com.sentinel.api.auth.dto.internal.RefreshTokenIssue;
import com.sentinel.api.auth.dto.request.ChangePasswordRequest;
import com.sentinel.api.auth.dto.request.LoginRequest;
import com.sentinel.api.auth.dto.response.ProfileResponse;
import com.sentinel.api.auth.mapper.AuthMapper;
import com.sentinel.api.auth.service.core.JwtService;
import com.sentinel.api.auth.service.core.RefreshTokenService;
import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.UnauthorizedException;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.service.core.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

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
    public AuthSessionResult login(LoginRequest request) {
        User user = userService.findActiveByEmailWithAuthorities(request.email());
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        user = userService.recordLastLogin(user);
        return issueSession(user);
    }

    @Override
    public AuthSessionResult refresh(String refreshTokenRaw) {
        if (refreshTokenRaw == null || refreshTokenRaw.isBlank()) {
            throw new UnauthorizedException("Missing refresh token");
        }
        RefreshTokenIssue rotated = refreshTokenService.rotate(refreshTokenRaw);
        User user = userService.findByIdWithAuthorities(rotated.entity().getUser().getId());
        String accessToken = jwtService.createAccessToken(user);
        return new AuthSessionResult(
            authMapper.toAuthSessionResponse(accessToken, jwtService.getAccessTokenTtlSeconds(), user),
            rotated.rawToken());
    }

    @Override
    public void logout(String refreshTokenRaw) {
        if (refreshTokenRaw != null && !refreshTokenRaw.isBlank()) {
            refreshTokenService.revoke(refreshTokenRaw);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse profile(UUID userId) {
        User user = userService.findByIdWithAuthorities(userId);
        return authMapper.toProfileResponse(user);
    }

    @Override
    public AuthSessionResult changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userService.findByIdWithAuthorities(userId);
        if (!passwordEncoder.matches(request.oldPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid current password");
        }
        if (request.oldPassword().equals(request.newPassword())) {
            throw new BadRequestException("New password must be different from the current password");
        }
        user = userService.updatePasswordHash(userId, passwordEncoder.encode(request.newPassword()));
        refreshTokenService.revokeAllForUser(userId);
        return issueSession(user);
    }

    private AuthSessionResult issueSession(User user) {
        RefreshTokenIssue refresh = refreshTokenService.issue(user);
        String accessToken = jwtService.createAccessToken(user);
        return new AuthSessionResult(
            authMapper.toAuthSessionResponse(accessToken, jwtService.getAccessTokenTtlSeconds(), user),
            refresh.rawToken());
    }
}
