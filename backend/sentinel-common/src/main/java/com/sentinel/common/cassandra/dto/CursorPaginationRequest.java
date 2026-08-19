package com.sentinel.common.cassandra.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CursorPaginationRequest {

    private String cursor;
    private int pageSize;
    private CursorPaginationDirection direction;

}
