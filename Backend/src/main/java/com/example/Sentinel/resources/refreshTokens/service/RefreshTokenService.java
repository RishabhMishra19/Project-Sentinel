package com.example.Sentinel.resources.refreshTokens.service;

import com.example.Sentinel.resources.refreshTokens.entity.RefreshToken;
import com.example.Sentinel.resources.users.entity.User;

import java.util.UUID;

public interface RefreshTokenService {

    String generate(User user);

    RefreshToken validate(String refreshToken);

    void revoke(RefreshToken refreshToken);

    void revokeAllByUser(UUID userId);

}
