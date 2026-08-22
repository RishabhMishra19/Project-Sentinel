package com.sentinel.common.cassandra.paginator;

public interface CursorEncoder<T, P> {

    String encode(T entity);
    P decode(String value);

}
