package com.sentinel.server.permission.service.core;

import com.sentinel.server.permission.entity.Permission;
import java.util.UUID;

public interface PermissionService {

    Permission getById(UUID id);
}
