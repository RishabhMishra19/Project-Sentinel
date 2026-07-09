package com.example.Sentinel.resources.projectEnvs.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import com.example.Sentinel.resources.orgProjects.entity.OrgProject;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(
        name = "project_envs",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_project_envs",
                columnNames = {"project_id", "name"}
        )
)
public class ProjectEnv extends UpdatableBaseEntity {

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectEnvCategory category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private OrgProject project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectEnvStatus status;
}