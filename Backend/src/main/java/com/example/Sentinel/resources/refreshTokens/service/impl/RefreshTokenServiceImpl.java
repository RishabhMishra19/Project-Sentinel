package com.example.Sentinel.resources.refreshTokens.service.impl;

import com.example.Sentinel.common.exceptions.BadRequestException;
import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.common.security.TokenService;
import com.example.Sentinel.resources.refreshTokens.constants.RefreshTokenErrorCodes;
import com.example.Sentinel.resources.refreshTokens.entity.RefreshToken;
import com.example.Sentinel.resources.refreshTokens.repository.RefreshTokenRepository;
import com.example.Sentinel.resources.refreshTokens.service.RefreshTokenService;
import com.example.Sentinel.resources.users.entity.User;
import com.example.Sentinel.resources.users.entity.repository.UserRepository;
import com.example.Sentinel.security.SecurityUtils;
import com.example.Sentinel.security.userDetails.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;
    private final TokenService tokenService;

    @Override
    public String generate(User user) {
        Instant now = Instant.now();
        String refreshToken = tokenService.generateToken();
        RefreshToken entity = RefreshToken.builder()
                                          .user(user)
                                          .tokenHash(tokenService.hash(refreshToken))
                                          .createdAt(now)
                                          .expiresAt(now.plusMillis(refreshTokenExpiration))
                                          .build();
        refreshTokenRepository.save(entity);
        return refreshToken;
    }

    @Override
    public RefreshToken validate(String refreshToken) {
        String tokenHash = tokenService.hash(refreshToken);

        RefreshToken token = refreshTokenRepository
                .findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResourceNotFoundException(
                        RefreshTokenErrorCodes.REFRESH_TOKEN_NOT_FOUND,
                        "Refresh Token not found."
                ));

        if (token.getRevokedAt() != null) {
            throw new BadRequestException(
                    RefreshTokenErrorCodes.REFRESH_TOKEN_REVOKED,
                    "Refresh token has been revoked."
            );
        }

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException(
                    RefreshTokenErrorCodes.REFRESH_TOKEN_EXPIRED,
                    "Refresh token has expired."
            );
        }

        return token;
    }

    @Override
    public void revoke(RefreshToken refreshToken) {
        CustomUserDetails currentUser = securityUtils.getCurrentUser();
        User revokedBy = userRepository.getReferenceById(currentUser.getId());
        refreshToken.setRevokedAt(Instant.now());
        refreshToken.setRevokedBy(revokedBy);
        refreshTokenRepository.save(refreshToken);
    }

}