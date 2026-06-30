package com.example.Sentinel.auth.service.impl;

import com.example.Sentinel.auth.dto.request.CreateAccountRequest;
import com.example.Sentinel.auth.dto.request.LoginRequest;
import com.example.Sentinel.auth.dto.request.RefreshAccessTokenRequest;
import com.example.Sentinel.auth.dto.request.SetPasswordRequest;
import com.example.Sentinel.auth.dto.response.CreateAccountResponse;
import com.example.Sentinel.auth.dto.response.LoginResponse;
import com.example.Sentinel.auth.dto.response.RefreshAccessTokenResponse;
import com.example.Sentinel.auth.service.AuthService;
import com.example.Sentinel.org.entity.Org;
import com.example.Sentinel.org.service.OrgService;
import com.example.Sentinel.user.entity.User;
import com.example.Sentinel.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserService userService;
    private OrgService orgService;

    @Override
    public CreateAccountResponse createAccount(CreateAccountRequest request) {
        Org org = orgService.createOrg(request.getCreateOrgRequest());
        User owner = userService.createUser(request.getCreateUserRequest(org.getId()));
        orgService.updateOwner(org.getId(), owner.getId());
        return CreateAccountResponse.builder()
                .orgId(org.getId())
                .ownerId(owner.getId())
                .build();
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        return null;
    }

    @Override
    public void setPassword(SetPasswordRequest request) {

    }

    @Override
    public RefreshAccessTokenResponse refreshAccessToken(RefreshAccessTokenRequest request) {
        return null;
    }

    @Override
    public void logout() {

    }
}
