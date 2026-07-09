package com.example.Sentinel.auth.dto.response;

import com.example.Sentinel.resources.users.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserResponse {

    private UUID id;

    private String name;

    private String email;

    private UserStatus status;

    private UUID orgId;

    private String orgName;

    private List<String> permissions;

    private List<String> roles;
}