package com.example.Sentinel.resources.userOrgs.entity;

import com.example.Sentinel.common.baseEntities.CreatedBaseEntity;
import com.example.Sentinel.resources.orgs.entity.Org;
import com.example.Sentinel.resources.users.entity.User;
import jakarta.persistence.Entity;
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
@Table(name = "user_orgs", uniqueConstraints = @UniqueConstraint(name = "uq_user_orgs", columnNames = {"user_id", "org_id"}))
public class UserOrg extends CreatedBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "org_id", nullable = false)
    private Org org;
}