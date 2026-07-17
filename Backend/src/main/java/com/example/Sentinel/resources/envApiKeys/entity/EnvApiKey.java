package com.example.Sentinel.resources.envApiKeys.entity;

import com.example.Sentinel.common.baseEntities.UpdatableBaseEntity;
import com.example.Sentinel.resources.projectEnvs.entity.ProjectEnv;
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
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@Entity
@Table(name = "env_api_keys", uniqueConstraints = @UniqueConstraint(name = "uq_env_api_keys", columnNames = {"env_id", "name"}))
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