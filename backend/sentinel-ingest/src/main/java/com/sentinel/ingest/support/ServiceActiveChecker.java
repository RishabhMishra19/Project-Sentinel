package com.sentinel.ingest.support;

import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class ServiceActiveChecker {

    private static final String ACTIVE = "ACTIVE";

    private final JdbcTemplate jdbcTemplate;

    public ServiceActiveChecker(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean isActive(UUID serviceId) {
        String status = jdbcTemplate.query(
                "SELECT status FROM services WHERE id = ?",
                rs -> rs.next() ? rs.getString(1) : null,
                serviceId);
        return ACTIVE.equals(status);
    }
}
