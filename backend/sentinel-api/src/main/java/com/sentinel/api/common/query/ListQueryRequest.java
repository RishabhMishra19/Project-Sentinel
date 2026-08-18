package com.sentinel.api.common.query;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;
import tools.jackson.databind.annotation.JsonDeserialize;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListQueryRequest {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;

    @JsonDeserialize(using = PageableDeserializer.class)
    private Pageable pageable;

    private List<ListQuerySortConfig> sortConfigs = new ArrayList<>();
    private List<ListQuerySearchConfig> searchConfigs = new ArrayList<>();
    private List<ListQueryFilterConfig> filterConfigs = new ArrayList<>();
    private Instant from;
    private Instant to;

    public Pageable toPageable(Set<String> allowedSortFields) {
        int page = pageable != null ? pageable.getPageNumber() : DEFAULT_PAGE;
        int size = pageable != null ? pageable.getPageSize() : DEFAULT_SIZE;
        if (page < 0) {
            page = DEFAULT_PAGE;
        }
        if (size < 1) {
            size = DEFAULT_SIZE;
        }

        List<Sort.Order> orders = new ArrayList<>();
        if (sortConfigs != null) {
            for (ListQuerySortConfig config : sortConfigs) {
                if (config == null || !StringUtils.hasText(config.getFieldName())) {
                    continue;
                }
                String field = config.getFieldName().trim();
                if (allowedSortFields != null
                        && !allowedSortFields.isEmpty()
                        && !allowedSortFields.contains(field)) {
                    continue;
                }
                Sort.Direction direction =
                        config.getSortDirection() == SortDirection.DESC
                                ? Sort.Direction.DESC
                                : Sort.Direction.ASC;
                orders.add(new Sort.Order(direction, field));
            }
        }

        Sort sort = orders.isEmpty() ? Sort.unsorted() : Sort.by(orders);
        return PageRequest.of(page, size, sort);
    }

    public Pageable toPageable(Set<String> allowedSortFields, Sort defaultSort) {
        Pageable resolved = toPageable(allowedSortFields);
        if (resolved.getSort().isSorted()) {
            return resolved;
        }
        return PageRequest.of(resolved.getPageNumber(), resolved.getPageSize(), defaultSort);
    }

    public List<String> filterValues(String fieldName) {
        if (filterConfigs == null || !StringUtils.hasText(fieldName)) {
            return List.of();
        }
        String target = fieldName.trim();
        for (ListQueryFilterConfig config : filterConfigs) {
            if (config == null || !StringUtils.hasText(config.getFieldName())) {
                continue;
            }
            if (target.equalsIgnoreCase(config.getFieldName().trim())) {
                if (config.getFilterValues() == null) {
                    return List.of();
                }
                return config.getFilterValues().stream()
                        .filter(StringUtils::hasText)
                        .map(String::trim)
                        .toList();
            }
        }
        return List.of();
    }

    public String firstFilterValue(String fieldName) {
        List<String> values = filterValues(fieldName);
        return values.isEmpty() ? null : values.getFirst();
    }
}
