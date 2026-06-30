package com.example.Sentinel.org.service.impl;

import com.example.Sentinel.common.exceptions.BadRequestException;
import com.example.Sentinel.common.exceptions.ConflictException;
import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.org.constants.OrgErrors;
import com.example.Sentinel.org.dto.request.CreateOrgRequest;
import com.example.Sentinel.org.dto.request.UpdateOrgRequest;
import com.example.Sentinel.org.entity.Org;
import com.example.Sentinel.org.entity.OrgStatus;
import com.example.Sentinel.org.repository.OrgRepository;
import com.example.Sentinel.org.service.OrgService;
import com.example.Sentinel.user.entity.User;
import com.example.Sentinel.user.entity.UserStatus;
import com.example.Sentinel.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class OrgServiceImpl implements OrgService {

    private final OrgRepository orgRepository;
    private final UserService userService;

    @Override
    public Org createOrg(CreateOrgRequest request) {
        if(orgRepository.existsByName(request.getName())){
            throw new ConflictException(OrgErrors.ORG_WITH_NAME_ALREADY_EXISTS.getErrorCode(), OrgErrors.ORG_WITH_NAME_ALREADY_EXISTS.getErrorMessage());
        }
        Org org = Org.builder()
                     .name(request.getName())
                     .status(OrgStatus.INACTIVE)
                     .build();
        return orgRepository.save(org);
    }

    @Override
    public Org updateOrg(UpdateOrgRequest request) {
        if(orgRepository.existsByName(request.getName())){
            throw new ConflictException(OrgErrors.ORG_WITH_NAME_ALREADY_EXISTS.getErrorCode(), OrgErrors.ORG_WITH_NAME_ALREADY_EXISTS.getErrorMessage());
        }
        Org org = this.getById(request.getId());
        org.setName(request.getName());
        return orgRepository.save(org);
    }

    @Override
    public Org getById(UUID id) {
        Optional<Org> orgOptional = orgRepository.findById(id);
        if(orgOptional.isEmpty()){
            throw new ResourceNotFoundException(OrgErrors.ORG_NOT_FOUND.getErrorCode(), OrgErrors.ORG_NOT_FOUND.getErrorMessage());
        }
        return orgOptional.get();
    }

    @Override
    public Org getByName(String name) {
        Optional<Org> orgOptional = orgRepository.findByName(name);
        if(orgOptional.isEmpty()){
            throw new ResourceNotFoundException(OrgErrors.ORG_NOT_FOUND.getErrorCode(), OrgErrors.ORG_NOT_FOUND.getErrorMessage());
        }
        return orgOptional.get();
    }

    @Override
    public Org updateOwner(UUID orgId, UUID newOwnerId) {
        Org org = this.getById(orgId);
        User newOwner = userService.findById(newOwnerId);
        if(!UserStatus.ACTIVE.equals(newOwner.getStatus()) || !newOwner.getOrgId().equals(orgId)){
            throw new BadRequestException(OrgErrors.INVALID_NEW_OWNER_FOR_ORG.getErrorCode(), OrgErrors.INVALID_NEW_OWNER_FOR_ORG.getErrorMessage());
        }
        org.setOwnerId(newOwnerId);
        return orgRepository.save(org);
    }
}
