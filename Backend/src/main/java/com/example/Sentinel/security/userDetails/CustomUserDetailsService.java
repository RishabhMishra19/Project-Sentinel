package com.example.Sentinel.security.userDetails;

import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.resources.permissions.entity.repository.PermissionRepository;
import com.example.Sentinel.resources.users.constants.UserErrorCodes;
import com.example.Sentinel.resources.users.entity.User;
import com.example.Sentinel.resources.users.entity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String email) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(UserErrorCodes.USER_NOT_FOUND, "User not found."));

        return this.build(user);
    }

    public CustomUserDetails loadCustomUserByUserId(UUID userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(UserErrorCodes.USER_NOT_FOUND, "User not found."));

        return this.build(user);
    }

    private CustomUserDetails build(User user) {
        List<GrantedAuthority> authorities = permissionRepository
                .findPermissionsByUserId(user.getId())
                .stream()
                .<GrantedAuthority>map(permission -> new SimpleGrantedAuthority(permission
                                                                                        .getEntity()
                                                                                        .name() + "_" + permission
                        .getAction()
                        .name()))
                .toList();
        return new CustomUserDetails(user.getId(), user.getEmail(), user.getPasswordHash(), authorities);
    }
}