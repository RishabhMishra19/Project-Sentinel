package com.example.Sentinel.resources.userRoles.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import com.example.Sentinel.resources.roles.entity.Role;
import com.example.Sentinel.resources.users.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "user_roles", uniqueConstraints = @UniqueConstraint(name = "uq_user_roles", columnNames = {"user_id", "role_id"}))
public class UserRole extends UpdatableBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRoleStatus status;
}