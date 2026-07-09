package com.example.Sentinel.resources.refreshTokens.service;

import com.example.Sentinel.resources.refreshTokens.entity.RefreshToken;
import com.example.Sentinel.resources.users.entity.User;

public interface RefreshTokenService {

    String generate(User user);

    String hash(String refreshToken);

    RefreshToken validate(String refreshToken);

    void revoke(RefreshToken refreshToken);

}
