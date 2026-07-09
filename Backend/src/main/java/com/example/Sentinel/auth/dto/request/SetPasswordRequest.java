package com.example.Sentinel.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetPasswordRequest {

    @NotBlank(message = "Invitation token is required")
    private String invitationToken;

    @NotBlank(message = "password is required")
    @Size(min = 8, max = 64, message = "Invalid length of password")
    private String password;
}
