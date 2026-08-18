package com.sentinel.api.common.query;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListQueryFilterConfig {

    private String fieldName;
    private List<String> filterValues = new ArrayList<>();
}
