package com.sentinel.api.common.response;

import com.sentinel.common.cassandra.dto.CursorPaginationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ApiResponses {

    private ApiResponses() {
    }

    public static <T> ResponseEntity<T> ok(T body) {
        return ResponseEntity.ok(body);
    }

    public static <T> ResponseEntity<T> created(T body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static <T> ResponseEntity<PageResponse<T>> okPage(PageResponse<T> page) {
        return ResponseEntity.ok(page);
    }

    public static <T> ResponseEntity<CursorPaginationResponse<T>> okPage(CursorPaginationResponse<T> page) {
        return ResponseEntity.ok(page);
    }

}
