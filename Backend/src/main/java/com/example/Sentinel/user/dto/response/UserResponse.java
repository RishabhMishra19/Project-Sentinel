package com.example.Sentinel.user.dto.response;

import com.example.Sentinel.user.entity.User;
import com.example.Sentinel.user.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    public UserResponse(User user){
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.orgId = user.getOrgId();
    }

    private UUID id;
    private String name;
    private String email;
    private UserRole role;
    private UUID orgId;

}
