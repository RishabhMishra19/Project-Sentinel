package com.sentinel.server.permission.service.core;

import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.permission.entity.Permission;
import com.sentinel.server.permission.repository.PermissionRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    @Transactional(readOnly = true)
    public Permission getById(UUID id) {
        return permissionRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found"));
    }
}
