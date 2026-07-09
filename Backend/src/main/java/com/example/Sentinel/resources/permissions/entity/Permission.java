package com.example.Sentinel.resources.permissions.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "permissions")
public class Permission extends UpdatableBaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionEntity entity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PermissionStatus status;
}