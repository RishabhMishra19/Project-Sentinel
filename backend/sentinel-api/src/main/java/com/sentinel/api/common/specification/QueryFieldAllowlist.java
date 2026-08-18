package com.sentinel.api.common.specification;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/** Allowlist of filter / search / sort / range fields for GenericSpecifications. */
public final class QueryFieldAllowlist {

    public enum FilterKind {
        EQUAL,
        GTE,
        STATUS_CLASS
    }

    public record FilterDef(String path, Class<?> type, FilterKind kind) {}

    private final Map<String, FilterDef> filters;
    private final Map<String, String> searchPaths;
    private final Set<String> defaultSearchPaths;
    private final Set<String> sortableFields;
    private final String rangePath;

    private QueryFieldAllowlist(
            Map<String, FilterDef> filters,
            Map<String, String> searchPaths,
            Set<String> defaultSearchPaths,
            Set<String> sortableFields,
            String rangePath) {
        this.filters = filters;
        this.searchPaths = searchPaths;
        this.defaultSearchPaths = defaultSearchPaths;
        this.sortableFields = sortableFields;
        this.rangePath = rangePath;
    }

    public Map<String, FilterDef> filters() {
        return filters;
    }

    public Map<String, String> searchPaths() {
        return searchPaths;
    }

    public Set<String> defaultSearchPaths() {
        return defaultSearchPaths;
    }

    public Set<String> sortableFields() {
        return sortableFields;
    }

    public String rangePath() {
        return rangePath;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private final Map<String, FilterDef> filters = new LinkedHashMap<>();
        private final Map<String, String> searchPaths = new LinkedHashMap<>();
        private final Set<String> defaultSearchPaths = new LinkedHashSet<>();
        private final Set<String> sortableFields = new LinkedHashSet<>();
        private String rangePath;

        public Builder equal(String fieldName, String path, Class<?> type) {
            filters.put(normalize(fieldName), new FilterDef(path, type, FilterKind.EQUAL));
            return this;
        }

        public Builder gte(String fieldName, String path, Class<?> type) {
            filters.put(normalize(fieldName), new FilterDef(path, type, FilterKind.GTE));
            return this;
        }

        public Builder statusClass(String fieldName, String statusCodePath) {
            filters.put(
                    normalize(fieldName),
                    new FilterDef(statusCodePath, Integer.class, FilterKind.STATUS_CLASS));
            return this;
        }

        public Builder search(String alias, String path) {
            searchPaths.put(normalize(alias), path);
            return this;
        }

        public Builder defaultSearch(String path) {
            defaultSearchPaths.add(path);
            return this;
        }

        public Builder sortable(String fieldName) {
            sortableFields.add(fieldName);
            return this;
        }

        public Builder rangePath(String path) {
            this.rangePath = path;
            return this;
        }

        public QueryFieldAllowlist build() {
            return new QueryFieldAllowlist(
                    Collections.unmodifiableMap(new HashMap<>(filters)),
                    Collections.unmodifiableMap(new HashMap<>(searchPaths)),
                    Collections.unmodifiableSet(new LinkedHashSet<>(defaultSearchPaths)),
                    Collections.unmodifiableSet(new LinkedHashSet<>(sortableFields)),
                    rangePath);
        }

        private static String normalize(String fieldName) {
            return fieldName.trim().toLowerCase();
        }
    }
}
