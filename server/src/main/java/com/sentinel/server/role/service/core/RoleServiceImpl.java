package com.sentinel.server.role.service.core;

import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.role.entity.Role;
import com.sentinel.server.role.repository.RoleRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    @Transactional(readOnly = true)
    public Role getById(UUID id) {
        return roleRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
    }
}
