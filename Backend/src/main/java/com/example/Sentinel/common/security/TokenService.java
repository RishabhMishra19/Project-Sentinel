package com.example.Sentinel.common.security;

public interface TokenService {

    String generateToken();

    String hash(String token);

}
