package com.example.Sentinel.resources.permissions.entity.service;

import java.util.List;
import java.util.UUID;

public interface PermissionService {

    List<String> getPermissionsByUserId(UUID userId);

}