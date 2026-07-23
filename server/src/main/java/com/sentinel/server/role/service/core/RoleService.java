package com.sentinel.server.role.service.core;

import com.sentinel.server.role.entity.Role;
import java.util.UUID;

public interface RoleService {

    Role getById(UUID id);
}
