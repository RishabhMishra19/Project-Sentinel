package com.example.Sentinel.user.service;

import com.example.Sentinel.user.dto.request.CreateUserRequest;
import com.example.Sentinel.user.dto.request.UpdateUserRequest;
import com.example.Sentinel.user.entity.User;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface UserService {

    User createUser(CreateUserRequest request);

    User updateUser(UpdateUserRequest request);

    User findById(UUID id);

    User findByEmail(String email);

    Page<User> findByOrgId(UUID orgId);

}
