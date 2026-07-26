package com.sentinel.worker.catalog;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class EndpointResolveService {

    private final JdbcTemplate jdbcTemplate;

    public EndpointResolveService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public UUID resolve(UUID serviceId, String method, String pathTemplate, Instant seenAt) {
        UUID id = UUID.randomUUID();
        Timestamp seen = Timestamp.from(seenAt);
        return jdbcTemplate.query(
                """
                INSERT INTO endpoints (id, service_id, method, path_template, first_seen_at, last_seen_at)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT (service_id, method, path_template)
                DO UPDATE SET last_seen_at = GREATEST(endpoints.last_seen_at, EXCLUDED.last_seen_at)
                RETURNING id
                """,
                rs -> {
                    rs.next();
                    return (UUID) rs.getObject("id");
                },
                id,
                serviceId,
                method,
                pathTemplate,
                seen,
                seen);
    }
}
