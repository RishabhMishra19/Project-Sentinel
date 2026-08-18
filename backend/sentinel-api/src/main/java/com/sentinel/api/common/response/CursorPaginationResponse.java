package com.sentinel.api.common.response;

import com.sentinel.api.common.query.CursorPaginationRequest;
import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.List;

import lombok.Getter;
import org.springframework.data.cassandra.core.query.CassandraPageRequest;
import org.springframework.data.domain.Slice;

public record CursorPaginationResponse<T>(
        List<T> content,
        int size,
        boolean hasNext,
        String nextCursor) {

    public static <T> CursorPaginationResponse<T> from(
            Slice<T> slice,
            CursorPaginationRequest request) {

        return new CursorPaginationResponse<>(
                slice.getContent(),
                slice.getNumberOfElements(),
                slice.hasNext(),
                getNextCursor(slice));
    }

    private static String getNextCursor(Slice<?> slice) {

        if (!slice.hasNext()) {
            return null;
        }

        CassandraPageRequest pageRequest =
                (CassandraPageRequest) slice.getPageable();

        ByteBuffer pagingState = pageRequest.getPagingState();

        if (pagingState == null) {
            return null;
        }

        byte[] bytes = new byte[pagingState.remaining()];
        pagingState.duplicate().get(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}