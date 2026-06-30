package com.example.Sentinel.auth.dto.request;

import com.example.Sentinel.org.dto.request.CreateOrgRequest;
import com.example.Sentinel.user.dto.request.CreateUserRequest;
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
public class CreateAccountRequest {

    @NotBlank(message = "Organization name is required")
    private String orgName;

    @NotBlank(message = "Owner name is required")
    private String ownerName;

    @NotBlank(message = "Owner email is required")
    @Email(message = "Invalid email format")
    private String ownerEmail;

    public CreateOrgRequest getCreateOrgRequest(){
        return CreateOrgRequest.builder()
                .name(this.orgName)
                .build();
    }

    public CreateUserRequest getCreateUserRequest(UUID orgId){
        return CreateUserRequest.builder()
                .name(this.ownerName)
                .email(this.ownerEmail)
                .role(UserRole.ADMIN)
                .orgId(orgId)
                .build();
    }

}
