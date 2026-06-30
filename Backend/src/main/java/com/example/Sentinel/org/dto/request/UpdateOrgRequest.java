package com.example.Sentinel.org.dto.request;

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
public class UpdateOrgRequest {

    @NotBlank(message = "Org Id is required")
    private UUID id;

    @NotBlank(message = "New Org name is required")
    private String name;

}
