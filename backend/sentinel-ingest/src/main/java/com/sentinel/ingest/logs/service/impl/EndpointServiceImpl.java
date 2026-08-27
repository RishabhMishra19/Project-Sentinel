package com.sentinel.ingest.logs.service.impl;

import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import com.sentinel.ingest.logs.dto.EndpointKey;
import com.sentinel.ingest.logs.service.EndpointService;
import com.sentinel.ingest.utils.IngestCache;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class EndpointServiceImpl implements EndpointService {

    private static final String ENDPOINT_KEY = "endpoint_key";
    private static final int TTL_IN_MS = 10 * 60 * 1000;

    private final JdbcTemplate jdbcTemplate;
    private final IngestCache ingestCache;
    private final ConcurrentHashMap<UUID, Instant> endpointLastSeenBuffer = new ConcurrentHashMap<>();
    private final AtomicLong lastTimeCommitedLastSeen = new AtomicLong(System.currentTimeMillis());

    public List<Endpoint> bulkInsertOrUpdateEndpoints(List<EndpointKey> endpointKeys) {
        if (endpointKeys == null || endpointKeys.isEmpty()) {
            return List.of();
        }
        StringBuilder sql = new StringBuilder("""
            INSERT INTO endpoints ( service_id, method, path_template, first_seen_at, last_seen_at )
            VALUES
        """);
        List<Object> params = new ArrayList<>(endpointKeys.size() * 5);
        for (int i = 0; i < endpointKeys.size(); i++) {
            if (i > 0) sql.append(", ");
            sql.append("(?, ?, ?, ?, ?)");
            EndpointKey endpointKey = endpointKeys.get(i);
            params.add(endpointKey.serviceId());
            params.add(endpointKey.method());
            params.add(endpointKey.pathTemplate());
            params.add(Timestamp.from(Instant.now()));
            params.add(Timestamp.from(Instant.now()));
        }
        sql.append("""
            ON CONFLICT (service_id, method, path_template)
            DO UPDATE SET last_seen_at = NOW()
            RETURNING id, service_id, method, path_template;
        """);
        return jdbcTemplate.query(sql.toString(), ps -> {
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
        }, (rs, rowNum) -> {
            Endpoint endpoint = new Endpoint();
            endpoint.setId(rs.getObject("id", UUID.class));
            endpoint.setServiceId(rs.getObject("service_id", UUID.class));
            endpoint.setMethod(rs.getString("method"));
            endpoint.setPathTemplate(rs.getString("path_template"));
            return endpoint;
        });
    }

    public void commitLastSeenForEndpointsIfApplicable() {
        long now = System.currentTimeMillis();
        long lastCommitted = lastTimeCommitedLastSeen.get();
        if (now - lastCommitted < 1000) {
            return;
        }
        if (!lastTimeCommitedLastSeen.compareAndSet(lastCommitted, now)) {
            return;
        }
        ConcurrentHashMap<UUID, Instant> snapshot = new ConcurrentHashMap<>(endpointLastSeenBuffer);
        if (snapshot.isEmpty()) {
            return;
        }
        StringBuilder sql = new StringBuilder("""
            UPDATE endpoints AS e
            SET last_seen_at = v.last_seen_at
            FROM (
                VALUES
        """);
        List<Object> params = new ArrayList<>(snapshot.size() * 2);
        int index = 0;
        for (Map.Entry<UUID, Instant> entry : snapshot.entrySet()) {
            if (index++ > 0) {
                sql.append(", ");
            }
            sql.append("(?::uuid, ?::timestamptz)");
            params.add(entry.getKey());
            params.add(Timestamp.from(entry.getValue()));
        }
        sql.append("""
            ) AS v(id, last_seen_at)
            WHERE e.id = v.id
        """);
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql.toString());
            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }
            return ps;
        });
        /*
         * Remove only the entries that still contain the
         * same timestamp that was committed.
         *
         * If a newer request updated the endpoint while the
         * DB operation was running, remove() will fail and
         * the newer timestamp remains in the buffer.
         */
        for (Map.Entry<UUID, Instant> entry : snapshot.entrySet()) {
            endpointLastSeenBuffer.remove(entry.getKey(), entry.getValue());
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Map<EndpointKey, UUID> upsertEndpointsAndReturnIdMapping(Set<EndpointKey> endpointKeys) {
        Map<EndpointKey, UUID> endpointIdMapping = new HashMap<>();
        List<EndpointKey> cacheMisses = new ArrayList<>();
        for (EndpointKey endpointKey : endpointKeys) {
            UUID endpointId = ingestCache.resolve(this.getEndpointKeyCacheKey(endpointKey));
            if (endpointId != null) {
                endpointIdMapping.put(endpointKey, endpointId);
                endpointLastSeenBuffer.put(endpointId, Instant.now());
            } else {
                cacheMisses.add(endpointKey);
            }
        }
        if (!cacheMisses.isEmpty()) {
            List<Endpoint> endpoints = this.bulkInsertOrUpdateEndpoints(cacheMisses);
            for (Endpoint endpoint : endpoints) {
                EndpointKey endpointKey = new EndpointKey(endpoint.getServiceId(), endpoint.getMethod(), endpoint.getPathTemplate());
                ingestCache.store(this.getEndpointKeyCacheKey(endpointKey), TTL_IN_MS, endpoint.getId());
                endpointIdMapping.put(endpointKey, endpoint.getId());
            }
        }
        this.commitLastSeenForEndpointsIfApplicable();
        return endpointIdMapping;
    }

    private String getEndpointKeyCacheKey(EndpointKey endpointKey) {
        return String.format("%s_%s", ENDPOINT_KEY, endpointKey.getHash());
    }

}
