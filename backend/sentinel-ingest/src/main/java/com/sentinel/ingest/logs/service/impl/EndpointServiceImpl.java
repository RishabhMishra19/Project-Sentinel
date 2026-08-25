package com.sentinel.ingest.logs.service.impl;

import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import com.sentinel.common.postgresql.endpoint.repository.EndpointRepository;
import com.sentinel.ingest.logs.service.EndpointService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EndpointServiceImpl implements EndpointService {

    private final EndpointRepository endpointRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Map<String, UUID>> findPathTemplateMappingForService(UUID serviceId) {
        List<Endpoint> endpoints = endpointRepository.findByServiceId(serviceId);
        Map<String, Map<String, UUID>> pathTemplateMapping = new HashMap<>();
        for (Endpoint endpoint : endpoints) {
            pathTemplateMapping.putIfAbsent(endpoint.getPathTemplate(), new HashMap<>());
            pathTemplateMapping.get(endpoint.getPathTemplate())
                .put(endpoint.getMethod(), endpoint.getId());
        }
        return pathTemplateMapping;
    }

    @Override
    public void bulkInsertEndpoints(List<Endpoint> endpoints) {
        if (endpoints == null || endpoints.isEmpty()) {
            return;
        }
        String sql = """
            INSERT INTO endpoints (
                id,
                service_id,
                method,
                path_template,
                first_seen_at,
                last_seen_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """;
        jdbcTemplate.batchUpdate(
            sql, endpoints, endpoints.size(), (ps, endPoint) -> {
                ps.setObject(1, endPoint.getId());
                ps.setObject(2, endPoint.getServiceId());
                ps.setString(3, endPoint.getMethod());
                ps.setString(4, endPoint.getPathTemplate());
                ps.setTimestamp(5, Timestamp.from(endPoint.getFirstSeenAt()));
                ps.setTimestamp(6, Timestamp.from(endPoint.getLastSeenAt()));
            }
        );
    }

    @Override
    public void bulkUpdateLastSeenToNow(List<UUID> endpointIds) {
        if (endpointIds == null || endpointIds.isEmpty())
            return;
        String sql = """
                UPDATE endpoints
                SET
                    last_seen_at = ?
                WHERE id = ?
            """;
        jdbcTemplate.batchUpdate(
            sql, endpointIds, endpointIds.size(), (ps, endpointId) -> {
                ps.setTimestamp(1, Timestamp.from(Instant.now()));
                ps.setObject(2, endpointId);
            }
        );
    }

}
