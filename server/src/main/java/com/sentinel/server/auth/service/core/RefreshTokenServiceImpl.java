package com.sentinel.server.auth.service.core;

import com.sentinel.server.auth.dto.RefreshTokenIssue;
import com.sentinel.server.auth.entity.RefreshToken;
import com.sentinel.server.auth.entity.RefreshTokenStatus;
import com.sentinel.server.auth.repository.RefreshTokenRepository;
import com.sentinel.server.common.exception.UnauthorizedException;
import com.sentinel.server.security.JwtProperties;
import com.sentinel.server.user.entity.User;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    public RefreshTokenIssue issue(User user) {
        String rawToken = generateRawToken();
        RefreshToken entity = new RefreshToken();
        entity.setUser(user);
        entity.setTokenHash(hash(rawToken));
        entity.setStatus(RefreshTokenStatus.ACTIVE);
        entity.setExpiresAt(Instant.now().plus(jwtProperties.getRefreshTokenTtl()));
        RefreshToken saved = refreshTokenRepository.save(entity);
        return new RefreshTokenIssue(rawToken, saved);
    }

    @Override
    public RefreshToken validateActive(String rawToken) {
        RefreshToken token = refreshTokenRepository
                .findByTokenHashAndStatus(hash(rawToken), RefreshTokenStatus.ACTIVE)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (token.getExpiresAt().isBefore(Instant.now())) {
            token.setStatus(RefreshTokenStatus.EXPIRED);
            refreshTokenRepository.save(token);
            throw new UnauthorizedException("Refresh token expired");
        }
        return token;
    }

    @Override
    public RefreshTokenIssue rotate(String rawToken) {
        RefreshToken existing = validateActive(rawToken);
        existing.setStatus(RefreshTokenStatus.REVOKED);
        existing.setRevokedAt(Instant.now());
        refreshTokenRepository.save(existing);
        return issue(existing.getUser());
    }

    @Override
    public void revoke(String rawToken) {
        refreshTokenRepository
                .findByTokenHashAndStatus(hash(rawToken), RefreshTokenStatus.ACTIVE)
                .ifPresent(token -> {
                    token.setStatus(RefreshTokenStatus.REVOKED);
                    token.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(token);
                });
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
