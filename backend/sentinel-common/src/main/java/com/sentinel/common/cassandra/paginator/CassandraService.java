package com.sentinel.common.cassandra.paginator;

import com.sentinel.common.cassandra.paginator.dto.CursorPaginationRequest;

import java.util.List;

public interface CassandraService<T, R extends CursorPaginationRequest, P> {

    List<T> getFirstPage(R request);

    List<T> getNextPage(R request, P decodedCursor);

    List<T> getPrevPage(R request, P decodedCursor);

}
