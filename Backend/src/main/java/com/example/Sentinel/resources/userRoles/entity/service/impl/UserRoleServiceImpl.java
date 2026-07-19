package com.example.Sentinel.resources.userRoles.entity.service.impl;

import com.example.Sentinel.resources.userRoles.entity.UserRole;
import com.example.Sentinel.resources.userRoles.entity.repository.UserRoleRepository;
import com.example.Sentinel.resources.userRoles.entity.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserRoleServiceImpl implements UserRoleService {

    private final UserRoleRepository userRoleRepository;

    @Override
    public List<UserRole> findRolesByUserId(UUID userId) {
        return userRoleRepository.findByUserId(userId);
    }

    @Override
    public Boolean isSuperAdmin(UUID userId) {
        List<UserRole> userRoles = this.findRolesByUserId(userId);
        for(UserRole userRole : userRoles){
            if(userRole.getRole().getName().equals("SUPER_USER")){
                return true;
            }
        }
        return false;
    }
}
