package com.example.Sentinel.user.service.impl;

import com.example.Sentinel.common.exceptions.ResourceNotFoundException;
import com.example.Sentinel.user.constants.UserErrors;
import com.example.Sentinel.user.dto.request.CreateUserRequest;
import com.example.Sentinel.user.dto.request.UpdateUserRequest;
import com.example.Sentinel.user.entity.User;
import com.example.Sentinel.user.entity.UserStatus;
import com.example.Sentinel.user.repository.UserRepository;
import com.example.Sentinel.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Override
    public User createUser(CreateUserRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .status(UserStatus.INVITED)
                .role(request.getRole())
                .orgId(request.getOrgId())
                .build();
        return userRepository.save(user);
    }

    @Override
    public User updateUser(UpdateUserRequest request) {
        User existingUser = this.findById(request.getId());
        existingUser.setName(request.getName());
        existingUser.setRole(request.getRole());
        return userRepository.save(existingUser);
    }

    @Override
    public User findById(UUID id) {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isEmpty()){
            throw new ResourceNotFoundException(UserErrors.USER_NOT_FOUND.getErrorCode(),  UserErrors.USER_NOT_FOUND.getErrorResponse());
        }
        return userOptional.get();
    }

    @Override
    public User findByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isEmpty()){
            throw new ResourceNotFoundException(UserErrors.USER_NOT_FOUND.getErrorCode(),  UserErrors.USER_NOT_FOUND.getErrorResponse());
        }
        return userOptional.get();
    }

    @Override
    public Page<User> findByOrgId(UUID orgId) {
        return userRepository.findByOrgId(orgId);
    }

}
