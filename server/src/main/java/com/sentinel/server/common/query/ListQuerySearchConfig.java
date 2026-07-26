package com.sentinel.server.common.query;

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
public class ListQuerySearchConfig {

    private String fieldName;
    private List<String> searchValues = new ArrayList<>();
}
