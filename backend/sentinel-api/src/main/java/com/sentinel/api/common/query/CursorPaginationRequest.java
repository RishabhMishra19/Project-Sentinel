package com.sentinel.api.common.query;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.cassandra.core.query.CassandraPageRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.nio.ByteBuffer;
import java.time.Instant;
import java.util.Base64;

@NoArgsConstructor
@Setter
@Getter
public abstract class CursorPaginationRequest {

    @NotNull(message = "from parameter is required")
    Instant from;

    @NotNull(message = "to parameter is required")
    Instant to;

    @NotNull(message = "limit parameter is required")
    private Integer limit;

    @NotNull(message = "cursor parameter is required")
    private String cursor;

    public CassandraPageRequest toPageRequest() {
        if (this.cursor == null || this.cursor.isBlank()) {
            return CassandraPageRequest.first(this.limit);
        }
        byte[] bytes = Base64.getUrlDecoder().decode(cursor);
        ByteBuffer pagingState = ByteBuffer.wrap(bytes);
        Pageable pageable = PageRequest.of(0, limit);
        return CassandraPageRequest.of(pageable, pagingState);
    }
}