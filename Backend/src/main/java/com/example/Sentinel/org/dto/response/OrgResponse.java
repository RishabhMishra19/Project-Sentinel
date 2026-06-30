package com.example.Sentinel.org.dto.response;

import com.example.Sentinel.org.entity.OrgStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrgResponse {

    private UUID id;
    private String name;
    private OrgStatus status;
    private UUID ownerId;
    private Instant createdAt;
    private Instant updatedAt;

}
