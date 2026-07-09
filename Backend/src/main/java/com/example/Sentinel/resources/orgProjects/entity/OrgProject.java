package com.example.Sentinel.resources.orgProjects.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import com.example.Sentinel.resources.orgs.entity.Org;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(
        name = "org_projects",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_org_projects",
                columnNames = {"org_id", "name"}
        )
)
public class OrgProject extends UpdatableBaseEntity {

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "org_id", nullable = false)
    private Org org;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrgProjectStatus status;
}