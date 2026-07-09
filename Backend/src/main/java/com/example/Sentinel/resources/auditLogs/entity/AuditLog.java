package com.example.Sentinel.resources.auditLogs.entity;

import com.example.Sentinel.common.baseEntities.CreatedBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import tools.jackson.databind.JsonNode;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "audit_logs")
public class AuditLog extends CreatedBaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private AuditEntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private java.util.UUID entityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_val", columnDefinition = "jsonb")
    private JsonNode oldVal;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_val", columnDefinition = "jsonb")
    private JsonNode newVal;
}