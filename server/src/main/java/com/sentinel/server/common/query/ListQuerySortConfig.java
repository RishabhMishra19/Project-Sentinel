package com.sentinel.server.common.query;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListQuerySortConfig {

    private String fieldName;
    private SortDirection sortDirection;
}
