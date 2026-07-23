package com.sentinel.server.user.service.core;

import com.sentinel.server.common.exception.UnauthorizedException;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.entity.UserStatus;
import com.sentinel.server.user.repository.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public User findActiveByEmailWithAuthorities(String email) {
        User user = userRepository
                .findByEmailWithRolesAndPermissions(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive");
        }
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public User findByIdWithAuthorities(UUID id) {
        User user = userRepository
                .findByIdWithRolesAndPermissions(id)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("User account is inactive");
        }
        return user;
    }
}
