package com.example.Sentinel.auth.service.impl;

import com.example.Sentinel.auth.dto.request.LoginRequest;
import com.example.Sentinel.auth.dto.request.LogoutRequest;
import com.example.Sentinel.auth.dto.request.RefreshTokenRequest;
import com.example.Sentinel.auth.dto.request.SetPasswordRequest;
import com.example.Sentinel.auth.dto.response.AuthResponse;
import com.example.Sentinel.auth.dto.response.CurrentUserResponse;
import com.example.Sentinel.auth.service.AuthService;
import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.resources.permissions.entity.repository.PermissionRepository;
import com.example.Sentinel.resources.permissions.entity.service.PermissionService;
import com.example.Sentinel.resources.refreshTokens.entity.RefreshToken;
import com.example.Sentinel.resources.refreshTokens.service.RefreshTokenService;
import com.example.Sentinel.resources.users.constants.UserErrorCodes;
import com.example.Sentinel.resources.users.entity.User;
import com.example.Sentinel.resources.users.entity.repository.UserRepository;
import com.example.Sentinel.security.jwt.JwtClaims;
import com.example.Sentinel.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final PermissionService permissionService;

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                                  .orElseThrow(() -> new ResourceNotFoundException(
                                          UserErrorCodes.USER_NOT_FOUND,
                                          "User not found."
                                  ));

        JwtClaims jwtClaims = JwtClaims.builder()
                                       .userId(user.getId())
                                       .email(user.getEmail())
                                       .build();

        String accessToken = jwtService.generateAccessToken(jwtClaims);

        String refreshToken = refreshTokenService.generate(user);

        List<String> permissions = permissionService.getPermissionsByUserId(user.getId());

        CurrentUserResponse currentUser = CurrentUserResponse.builder()
                                                             .id(user.getId())
                                                             .name(user.getName())
                                                             .email(user.getEmail())
                                                             .status(user.getStatus())
                                                             .permissions(permissions)
                                                             .build();

        return AuthResponse.builder()
                           .accessToken(accessToken)
                           .refreshToken(refreshToken)
                           .user(currentUser)
                           .build();
    }

    @Override
    public AuthResponse refreshAccessToken(RefreshTokenRequest request) {
        RefreshToken refreshToken =
                refreshTokenService.validate(request.getRefreshToken());

        User user = refreshToken.getUser();

        JwtClaims jwtClaims = JwtClaims.builder()
                                       .userId(user.getId())
                                       .email(user.getEmail())
                                       .build();

        String accessToken = jwtService.generateAccessToken(jwtClaims);

        List<String> permissions =
                permissionService.getPermissionsByUserId(user.getId());

        CurrentUserResponse currentUser = CurrentUserResponse.builder()
                                                             .id(user.getId())
                                                             .name(user.getName())
                                                             .email(user.getEmail())
                                                             .status(user.getStatus())
                                                             .permissions(permissions)
                                                             .build();

        return AuthResponse.builder()
                           .accessToken(accessToken)
                           .refreshToken(request.getRefreshToken())
                           .user(currentUser)
                           .build();
    }

    @Override
    public void logout(LogoutRequest request) {
        RefreshToken refreshToken =
                refreshTokenService.validate(request.getRefreshToken());

        refreshTokenService.revoke(refreshToken);
    }

    @Override
    public AuthResponse setPassword(SetPasswordRequest request) {
        return null;
    }

}
