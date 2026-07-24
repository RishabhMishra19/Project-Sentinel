package com.sentinel.server.user.service.core;

import com.sentinel.server.user.entity.User;
import java.util.UUID;

public interface UserService {

    User findActiveByEmailWithAuthorities(String email);

    User findByIdWithAuthorities(UUID id);

    User updatePasswordHash(UUID userId, String newPasswordHash);
}
