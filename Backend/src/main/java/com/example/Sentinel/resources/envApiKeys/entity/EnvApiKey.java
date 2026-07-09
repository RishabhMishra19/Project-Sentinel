package com.example.Sentinel.resources.envApiKeys.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import com.example.Sentinel.resources.projectEnvs.entity.ProjectEnv;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(
        name = "env_api_keys",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_env_api_keys",
                columnNames = {"env_id", "name"}
        )
)
public class EnvApiKey extends UpdatableBaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "api_key_hash", nullable = false)
    private String apiKeyHash;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "env_id", nullable = false)
    private ProjectEnv env;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnvApiKeyStatus status;
}