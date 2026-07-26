package com.sentinel.server.common.query;

import com.sentinel.server.common.exception.BadRequestException;
import java.util.Locale;
import java.util.UUID;
import org.springframework.util.StringUtils;

/** Helpers to read typed values from ListQueryRequest.filterConfigs (e.g. Analytics). */
public final class ListQueryFilterReader {

    private ListQueryFilterReader() {}

    public static String require(ListQueryRequest query, String fieldName) {
        String value = query != null ? query.firstFilterValue(fieldName) : null;
        if (!StringUtils.hasText(value)) {
            throw new BadRequestException("Missing required filter '" + fieldName + "'");
        }
        return value;
    }

    public static <E extends Enum<E>> E requireEnum(
            ListQueryRequest query, String fieldName, Class<E> type) {
        String raw = require(query, fieldName);
        try {
            return Enum.valueOf(type, raw.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid value for filter '" + fieldName + "': " + raw);
        }
    }

    public static <E extends Enum<E>> E optionalEnum(
            ListQueryRequest query, String fieldName, Class<E> type, E defaultValue) {
        String raw = query != null ? query.firstFilterValue(fieldName) : null;
        if (!StringUtils.hasText(raw)) {
            return defaultValue;
        }
        try {
            return Enum.valueOf(type, raw.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid value for filter '" + fieldName + "': " + raw);
        }
    }

    public static UUID optionalUuid(ListQueryRequest query, String fieldName) {
        String raw = query != null ? query.firstFilterValue(fieldName) : null;
        if (!StringUtils.hasText(raw)) {
            return null;
        }
        try {
            return UUID.fromString(raw.trim());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid value for filter '" + fieldName + "': " + raw);
        }
    }
}
