package com.example.Sentinel.resources.permissions.entity.service.impl;

import com.example.Sentinel.resources.permissions.entity.Permission;
import com.example.Sentinel.resources.permissions.entity.repository.PermissionRepository;
import com.example.Sentinel.resources.permissions.entity.service.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    public List<String> getPermissionsByUserId(UUID userId) {
        List<Permission> permissions = permissionRepository.findPermissionsByUserId(userId);
        return permissions.stream().map(v -> v.getEntity() + "_" + v.getAction()).toList();
    }
}
