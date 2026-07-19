package com.example.Sentinel.resources.userOrgs.entity.service.impl;

import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.resources.orgs.entity.Org;
import com.example.Sentinel.resources.userOrgs.entity.UserOrg;
import com.example.Sentinel.resources.userOrgs.entity.constants.UserOrgErrorCodes;
import com.example.Sentinel.resources.userOrgs.entity.repository.UserOrgRepository;
import com.example.Sentinel.resources.userOrgs.entity.service.UserOrgService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserOrgServiceImpl implements UserOrgService {

    private final UserOrgRepository userOrgRepository;

    @Override
    public Org findOrgByUserId(UUID userId) {
        UserOrg userOrg = userOrgRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserOrgErrorCodes.NO_ORG_FOUND_FOR_USER,
                                                                 "No Org found for user."));
        return userOrg.getOrg();
    }
}
