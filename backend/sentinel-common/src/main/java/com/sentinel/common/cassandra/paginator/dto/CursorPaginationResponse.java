package com.sentinel.common.cassandra.paginator.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CursorPaginationResponse<T> {

    private List<T> content;
    private String startCursor;
    private String endCursor;
    private boolean hasNextPage;
    private boolean hasPreviousPage;

    public <R> CursorPaginationResponse<R> getApiResponse(List<R> apiResult){
        return new CursorPaginationResponse<R>(
                apiResult,
                startCursor,
                endCursor,
                hasNextPage,
                hasPreviousPage
        );
    }

}
