package com.sentinel.common.cassandra;

import com.sentinel.common.cassandra.dto.CursorPaginationRequest;

import java.util.List;

public interface CassandraService<T, R extends CursorPaginationRequest, P> {

    List<T> getFirstPage(R request);

    List<T> getNextPage(R request, P decodedCursor);

    List<T> getPrevPage(R request, P decodedCursor);

}
