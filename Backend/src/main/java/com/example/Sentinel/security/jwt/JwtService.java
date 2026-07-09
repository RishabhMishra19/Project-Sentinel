package com.example.Sentinel.security.jwt;

public interface JwtService {

    String generateAccessToken(JwtClaims claims);

    JwtClaims extractClaims(String accessToken);

    boolean isTokenValid(String accessToken);

}
