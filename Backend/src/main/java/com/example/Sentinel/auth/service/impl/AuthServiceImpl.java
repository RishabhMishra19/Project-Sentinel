package com.example.Sentinel.auth.service.impl;

import com.example.Sentinel.auth.dto.request.ChangePasswordRequest;
import com.example.Sentinel.auth.dto.request.LoginRequest;
import com.example.Sentinel.auth.dto.request.LogoutRequest;
import com.example.Sentinel.auth.dto.request.RefreshTokenRequest;
import com.example.Sentinel.auth.dto.request.SetPasswordRequest;
import com.example.Sentinel.auth.dto.response.AuthResponse;
import com.example.Sentinel.auth.dto.response.CurrentUserResponse;
import com.example.Sentinel.auth.service.AuthService;
import com.example.Sentinel.common.exceptions.BadRequestException;
import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.resources.invitations.entity.Invitation;
import com.example.Sentinel.resources.invitations.entity.InvitationStatus;
import com.example.Sentinel.resources.invitations.service.InvitationService;
import com.example.Sentinel.resources.orgs.entity.Org;
import com.example.Sentinel.resources.permissions.entity.service.PermissionService;
import com.example.Sentinel.resources.refreshTokens.entity.RefreshToken;
import com.example.Sentinel.resources.refreshTokens.service.RefreshTokenService;
import com.example.Sentinel.resources.roles.entity.RoleStatus;
import com.example.Sentinel.resources.userRoles.entity.service.UserRoleService;
import com.example.Sentinel.resources.userOrgs.entity.UserOrg;
import com.example.Sentinel.resources.userOrgs.entity.repository.UserOrgRepository;
import com.example.Sentinel.resources.userOrgs.entity.service.UserOrgService;
import com.example.Sentinel.resources.userRoles.entity.UserRole;
import com.example.Sentinel.resources.userRoles.entity.repository.UserRoleRepository;
import com.example.Sentinel.resources.users.constants.UserErrorCodes;
import com.example.Sentinel.resources.users.entity.User;
import com.example.Sentinel.resources.users.entity.UserStatus;
import com.example.Sentinel.resources.users.entity.repository.UserRepository;
import com.example.Sentinel.security.SecurityUtils;
import com.example.Sentinel.security.jwt.JwtClaims;
import com.example.Sentinel.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PermissionService permissionService;
    private final InvitationService invitationService;
    private final PasswordEncoder passwordEncoder;
    private final UserOrgRepository userOrgRepository;
    private final UserOrgService userOrgService;
    private final UserRoleRepository userRoleRepository;
    private final SecurityUtils securityUtils;
    private final UserRoleService userRoleService;

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(UserErrorCodes.USER_NOT_FOUND, "User not found."));

        return this.buildAuthResponse(user);
    }

    @Override
    public AuthResponse refreshAccessToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.validate(request.getRefreshToken());

        User user = refreshToken.getUser();

        return this.buildAuthResponse(user);
    }

    @Override
    public void logout(LogoutRequest request) {
        RefreshToken refreshToken = refreshTokenService.validate(request.getRefreshToken());

        refreshTokenService.revoke(refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse setPassword(SetPasswordRequest request) {

        Invitation invitation = invitationService.validateInvitation(request.getInvitationToken());

        if (userRepository.existsByEmail(invitation.getEmail())) {
            throw new BadRequestException(UserErrorCodes.USER_ALREADY_EXISTS, "User already exists.");
        }

        User user = User
                .builder()
                .name(invitation.getName())
                .email(invitation.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        UserOrg userOrg = UserOrg.builder().user(user).org(invitation.getOrg()).build();

        userOrgRepository.save(userOrg);

        UserRole userRole = UserRole.builder().user(user).role(invitation.getRole()).build();

        userRoleRepository.save(userRole);

        invitation.setStatus(InvitationStatus.ACCEPTED);

        return this.buildAuthResponse(user);
    }

    @Override
    public CurrentUserResponse getLoggedInUser() {
        UUID currentLoggedInUserId = securityUtils.getCurrentUser().getId();
        User loggedInUser = userRepository
                .findById(currentLoggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException(UserErrorCodes.USER_NOT_FOUND, "User not found."));
        return this.buildUserResponse(loggedInUser);
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        UUID currentLoggedInUserId = securityUtils.getCurrentUser().getId();
        User loggedInUser = userRepository
                .findById(currentLoggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException(UserErrorCodes.USER_NOT_FOUND, "User not found."));
        loggedInUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        refreshTokenService.revokeAllByUser(loggedInUser.getId());
    }

    private AuthResponse buildAuthResponse(User user) {

        JwtClaims jwtClaims = JwtClaims.builder().userId(user.getId()).email(user.getEmail()).build();

        String accessToken = jwtService.generateAccessToken(jwtClaims);

        String refreshToken = refreshTokenService.generate(user);

        CurrentUserResponse currentUser = this.buildUserResponse(user);

        return AuthResponse.builder().accessToken(accessToken).refreshToken(refreshToken).user(currentUser).build();
    }

    private CurrentUserResponse buildUserResponse(User user) {
        List<String> permissions = permissionService.getPermissionsByUserId(user.getId());
        List<UserRole> roles = userRoleService.findRolesByUserId(user.getId());
        List<String> rolesList = roles.stream().filter(v-> RoleStatus.ACTIVE.equals(v.getRole().getStatus())).map(v->v.getRole().getName()).toList();
        Org org = userOrgService.findOrgByUserId(user.getId());

        return CurrentUserResponse
                .builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .status(user.getStatus())
                .permissions(permissions)
                .roles(rolesList)
                .orgId(org.getId())
                .orgName(org.getName())
                .emailVerified(user.isEmailVerified())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

}
