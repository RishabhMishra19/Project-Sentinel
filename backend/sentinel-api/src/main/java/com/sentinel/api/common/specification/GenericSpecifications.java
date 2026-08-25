package com.sentinel.api.common.specification;

import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.query.ListQueryFilterConfig;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.query.ListQuerySearchConfig;
import com.sentinel.api.common.specification.QueryFieldAllowlist.FilterDef;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

public final class GenericSpecifications {

    private GenericSpecifications() {
    }

    public static <T> Specification<T> from(ListQueryRequest query, QueryFieldAllowlist allowlist) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (query != null) {
                addFilterPredicates(predicates, root, cb, query, allowlist);
                addSearchPredicates(predicates, root, cb, query, allowlist);
                addRangePredicates(predicates, root, cb, query, allowlist);
            }

            if (predicates.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static <T> void addFilterPredicates(
        List<Predicate> predicates,
        Root<T> root,
        CriteriaBuilder cb,
        ListQueryRequest query,
        QueryFieldAllowlist allowlist) {
        if (query.getFilterConfigs() == null) {
            return;
        }
        for (ListQueryFilterConfig config : query.getFilterConfigs()) {
            if (config == null || !StringUtils.hasText(config.getFieldName())) {
                continue;
            }
            FilterDef def = allowlist.filters().get(config.getFieldName().trim().toLowerCase(Locale.ROOT));
            if (def == null) {
                continue;
            }
            List<String> rawValues =
                config.getFilterValues() == null
                    ? List.of()
                    : config.getFilterValues().stream()
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .toList();
            if (rawValues.isEmpty()) {
                continue;
            }

            Path<?> path = resolvePath(root, def.path());
            switch (def.kind()) {
                case EQUAL -> predicates.add(
                    equalOrIn(cb, path, coerceAll(rawValues, def.type(), config.getFieldName())));
                case GTE -> {
                    Object value = coerce(rawValues.getFirst(), def.type(), config.getFieldName());
                    predicates.add(gte(cb, path, value));
                }
                case STATUS_CLASS -> {
                    Predicate statusClassPred = statusClassPredicate(cb, path, rawValues);
                    if (statusClassPred != null) {
                        predicates.add(statusClassPred);
                    }
                }
            }
        }
    }

    private static <T> void addSearchPredicates(
        List<Predicate> predicates,
        Root<T> root,
        CriteriaBuilder cb,
        ListQueryRequest query,
        QueryFieldAllowlist allowlist) {
        if (query.getSearchConfigs() == null || query.getSearchConfigs().isEmpty()) {
            return;
        }

        List<Predicate> searchPreds = new ArrayList<>();
        for (ListQuerySearchConfig config : query.getSearchConfigs()) {
            if (config == null || config.getSearchValues() == null) {
                continue;
            }
            List<String> values =
                config.getSearchValues().stream()
                    .filter(StringUtils::hasText)
                    .map(v -> v.trim().toLowerCase(Locale.ROOT))
                    .toList();
            if (values.isEmpty()) {
                continue;
            }

            Collection<String> paths;
            if (StringUtils.hasText(config.getFieldName())) {
                String path =
                    allowlist.searchPaths().get(config.getFieldName().trim().toLowerCase(Locale.ROOT));
                if (path == null) {
                    continue;
                }
                paths = List.of(path);
            } else if (!allowlist.defaultSearchPaths().isEmpty()) {
                paths = allowlist.defaultSearchPaths();
            } else {
                continue;
            }

            for (String path : paths) {
                Expression<String> stringPath = resolvePath(root, path).as(String.class);
                for (String value : values) {
                    searchPreds.add(cb.like(cb.lower(stringPath), "%" + value + "%"));
                }
            }
        }

        if (!searchPreds.isEmpty()) {
            predicates.add(cb.or(searchPreds.toArray(Predicate[]::new)));
        }
    }

    private static <T> void addRangePredicates(
        List<Predicate> predicates,
        Root<T> root,
        CriteriaBuilder cb,
        ListQueryRequest query,
        QueryFieldAllowlist allowlist) {
        if (!StringUtils.hasText(allowlist.rangePath())) {
            return;
        }
        Expression<Instant> path = resolvePath(root, allowlist.rangePath()).as(Instant.class);
        if (query.getFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(path, query.getFrom()));
        }
        if (query.getTo() != null) {
            predicates.add(cb.lessThan(path, query.getTo()));
        }
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private static Predicate equalOrIn(CriteriaBuilder cb, Path<?> path, List<?> values) {
        if (values.size() == 1) {
            return cb.equal(path, values.getFirst());
        }
        return path.in((Collection) values);
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    private static Predicate gte(CriteriaBuilder cb, Path<?> path, Object value) {
        return cb.greaterThanOrEqualTo((Expression) path, (Comparable) value);
    }

    private static Predicate statusClassPredicate(
        CriteriaBuilder cb, Path<?> statusCodePath, List<String> tokens) {
        List<Predicate> classPreds = new ArrayList<>();
        Expression<Integer> path = statusCodePath.as(Integer.class);
        for (String token : tokens) {
            for (String part : token.split(",")) {
                if (!StringUtils.hasText(part)) {
                    continue;
                }
                switch (part.trim().toLowerCase(Locale.ROOT)) {
                    case "2xx" -> classPreds.add(cb.between(path, 200, 299));
                    case "3xx" -> classPreds.add(cb.between(path, 300, 399));
                    case "4xx" -> classPreds.add(cb.between(path, 400, 499));
                    case "5xx" -> classPreds.add(cb.between(path, 500, 599));
                    default -> {
                    }
                }
            }
        }
        if (classPreds.isEmpty()) {
            return null;
        }
        return cb.or(classPreds.toArray(Predicate[]::new));
    }

    private static Path<?> resolvePath(Root<?> root, String path) {
        String[] parts = path.split("\\.");
        Path<?> current = root.get(parts[0]);
        for (int i = 1; i < parts.length; i++) {
            current = current.get(parts[i]);
        }
        return current;
    }

    private static List<Object> coerceAll(List<String> rawValues, Class<?> type, String fieldName) {
        List<Object> values = new ArrayList<>(rawValues.size());
        for (String raw : rawValues) {
            values.add(coerce(raw, type, fieldName));
        }
        return values;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private static Object coerce(String raw, Class<?> type, String fieldName) {
        try {
            if (type == String.class) {
                return raw;
            }
            if (type == UUID.class) {
                return UUID.fromString(raw);
            }
            if (type == Integer.class || type == int.class) {
                return Integer.valueOf(raw);
            }
            if (type == Long.class || type == long.class) {
                return Long.valueOf(raw);
            }
            if (type == Boolean.class || type == boolean.class) {
                return Boolean.valueOf(raw);
            }
            if (type.isEnum()) {
                return Enum.valueOf((Class<? extends Enum>) type, raw.toUpperCase(Locale.ROOT));
            }
            if (type == Instant.class) {
                return Instant.parse(raw);
            }
        } catch (RuntimeException ex) {
            throw new BadRequestException("Invalid value for filter '" + fieldName + "': " + raw);
        }
        throw new BadRequestException("Unsupported filter type for '" + fieldName + "'");
    }
}
