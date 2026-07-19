package com.example.Sentinel.resources.userRoles.entity.service;

import com.example.Sentinel.resources.userRoles.entity.UserRole;

import java.util.List;
import java.util.UUID;

public interface UserRoleService {
    List<UserRole> findRolesByUserId(UUID userId);
    Boolean isSuperAdmin(UUID userId);
}
