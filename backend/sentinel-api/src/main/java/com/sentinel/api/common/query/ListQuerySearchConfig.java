package com.sentinel.api.common.query;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListQuerySearchConfig {

    private String fieldName;
    private List<String> searchValues = new ArrayList<>();
}
