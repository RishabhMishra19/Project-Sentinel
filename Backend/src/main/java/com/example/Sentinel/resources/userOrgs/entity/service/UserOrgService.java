package com.example.Sentinel.resources.userOrgs.entity.service;

import com.example.Sentinel.resources.orgs.entity.Org;

import java.util.UUID;

public interface UserOrgService {
    Org findOrgByUserId(UUID userId);
}
