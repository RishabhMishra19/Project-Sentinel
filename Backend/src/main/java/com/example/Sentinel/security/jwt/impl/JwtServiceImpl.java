package com.example.Sentinel.security.jwt.impl;

import com.example.Sentinel.security.jwt.JwtClaims;
import com.example.Sentinel.security.jwt.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Override
    public String generateAccessToken(JwtClaims claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                   .subject(claims.getEmail())
                   .claim("userId", claims.getUserId().toString())
                   .issuedAt(Date.from(now))
                   .expiration(Date.from(now.plusMillis(accessTokenExpiration)))
                   .signWith(getSigningKey())
                   .compact();
    }

    @Override
    public JwtClaims extractClaims(String accessToken) {
        Claims claims = extractAllClaims(accessToken);

        return JwtClaims.builder()
                        .userId(UUID.fromString(claims.get("userId", String.class)))
                        .email(claims.getSubject())
                        .build();
    }

    @Override
    public boolean isTokenValid(String accessToken) {
        try {
            Claims claims = extractAllClaims(accessToken);
            return !claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                   .verifyWith(getSigningKey())
                   .build()
                   .parseSignedClaims(token)
                   .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] key = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(key);
    }

}
