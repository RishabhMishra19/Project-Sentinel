package com.sentinel.common.cassandra.requestlog.service;

import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import com.datastax.oss.driver.api.core.cql.SimpleStatement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestLogCleanupService {

    private static final int DELETE_LOG_BATCH_SIZE = 50;

    private final CassandraTemplate cassandraTemplate;

    public void deleteRequestLogs(List<UUID> tenantIds, List<UUID> serviceIds) {
        if (tenantIds == null || tenantIds.isEmpty() || serviceIds == null || serviceIds.isEmpty()) {
            return;
        }

        String tenantIdValues = tenantIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

        String serviceIdValues = serviceIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

        String selectCql = """
            SELECT id
            FROM request_logs
            WHERE tenant_id IN (%s)
              AND service_id IN (%s)
            """.formatted(tenantIdValues, serviceIdValues);

        SimpleStatement statement = SimpleStatement.builder(selectCql).setPageSize(DELETE_LOG_BATCH_SIZE).build();

        ResultSet resultSet = cassandraTemplate.getCqlOperations().queryForResultSet(statement);

        List<UUID> requestLogIds = new ArrayList<>(DELETE_LOG_BATCH_SIZE);

        for (Row row : resultSet) {
            requestLogIds.add(row.get("id", UUID.class));

            if (requestLogIds.size() == DELETE_LOG_BATCH_SIZE) {
                String ids = requestLogIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

                cassandraTemplate.getCqlOperations().execute("DELETE FROM request_logs_lookup_by_id WHERE id IN (" + ids + ")");

                requestLogIds.clear();
            }
        }

        if (!requestLogIds.isEmpty()) {
            String ids = requestLogIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

            cassandraTemplate.getCqlOperations().execute("DELETE FROM request_logs_lookup_by_id WHERE id IN (" + ids + ")");
        }

        String deleteLogsCql = """
            DELETE FROM request_logs
            WHERE tenant_id IN (%s)
              AND service_id IN (%s)
            """.formatted(tenantIdValues, serviceIdValues);

        cassandraTemplate.getCqlOperations().execute(deleteLogsCql);
    }

}
