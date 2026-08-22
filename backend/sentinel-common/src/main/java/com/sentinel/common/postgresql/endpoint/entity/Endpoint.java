package com.sentinel.common.postgresql.endpoint.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "endpoints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Endpoint {

    @Id
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "service_id", nullable = false)
    private UUID serviceId;

    @Column(name = "method", nullable = false)
    private String method;

    @Column(name = "path_template", nullable = false)
    private String pathTemplate;

    @Column(name = "first_seen_at")
    private Instant firstSeenAt;

    @Column(name = "last_seen_at")
    private Instant lastSeenAt;
}