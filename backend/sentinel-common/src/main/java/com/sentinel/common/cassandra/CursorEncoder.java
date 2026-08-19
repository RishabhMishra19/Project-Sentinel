package com.sentinel.common.cassandra;

public interface CursorEncoder<T, P> {

    String encode(T entity);
    P decode(String value);

}
