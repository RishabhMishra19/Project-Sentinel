package com.example.Sentinel.org.service;

import com.example.Sentinel.org.dto.request.CreateOrgRequest;
import com.example.Sentinel.org.dto.request.UpdateOrgRequest;
import com.example.Sentinel.org.entity.Org;

import java.util.UUID;

public interface OrgService {

    Org createOrg(CreateOrgRequest request);

    Org updateOrg(UpdateOrgRequest request);

    Org getById(UUID id);

    Org getByName(String name);

    Org updateOwner(UUID orgId, UUID newOwnerId);

}
