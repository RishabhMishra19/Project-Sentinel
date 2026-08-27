package com.sentinel.common.cassandra;

import lombok.RequiredArgsConstructor;
import org.springframework.data.cassandra.core.CassandraBatchOperations;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class CassandraBatchInsertUtil {

    private static final int DEFAULT_BATCH_SIZE = 50;

    private final CassandraTemplate cassandraTemplate;

    public <T> void insert(List<T> entities) {
        insert(entities, DEFAULT_BATCH_SIZE);
    }

    public <T> void insert(List<T> entities, int batchSize) {
        if (entities == null || entities.isEmpty()) {
            return;
        }

        if (batchSize <= 0) {
            throw new IllegalArgumentException("Batch size must be greater than 0");
        }

        for (int from = 0; from < entities.size(); from += batchSize) {
            int to = Math.min(from + batchSize, entities.size());

            CassandraBatchOperations batch = cassandraTemplate.batchOps();

            entities.subList(from, to)
                .forEach(batch::insert);

            batch.execute();
        }
    }
}
