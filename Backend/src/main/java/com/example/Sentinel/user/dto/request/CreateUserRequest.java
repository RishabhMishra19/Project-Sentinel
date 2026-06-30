package com.example.Sentinel.user.dto.request;

import com.example.Sentinel.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
public class CreateUserRequest {

    @NotBlank(message = "User's name is required")
    private String name;

    @NotBlank(message = "User's email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "User's org is required")
    private UUID orgId;

    @NotBlank(message = "User's role is required")
    private UserRole role;
}
