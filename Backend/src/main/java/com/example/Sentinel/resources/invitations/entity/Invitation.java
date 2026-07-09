package com.example.Sentinel.resources.invitations.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import com.example.Sentinel.resources.orgs.entity.Org;
import com.example.Sentinel.resources.roles.entity.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.Instant;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "invitations")
public class Invitation extends UpdatableBaseEntity {

    @Column(nullable = false)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "org_id", nullable = false)
    private Org org;

    @Column(name = "hashed_token", nullable = false, unique = true)
    private String hashedToken;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvitationStatus status;

}