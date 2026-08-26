package com.sentinel.ingest.utils;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public final class PathTemplateDeriver {

    private static final int MAX_LENGTH = 512;

    private static final Pattern UUID_PATTERN = Pattern.compile(
        "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    );

    private static final Pattern NUMERIC_PATTERN = Pattern.compile(
        "^\\d+$"
    );

    private static final Pattern ULID_PATTERN = Pattern.compile(
        "^[0-9A-HJKMNP-TV-Z]{26}$"
    );

    private static final Pattern OBJECT_ID_PATTERN = Pattern.compile(
        "^[0-9a-fA-F]{24}$"
    );

    public String derive(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            return "/";
        }

        String path = normalizePath(rawPath);

        if (path.isEmpty() || path.equals("/")) {
            return "/";
        }

        String[] segments = path.substring(1).split("/");

        StringBuilder template = new StringBuilder(path.length());

        for (String segment : segments) {
            if (segment.isEmpty()) {
                continue;
            }

            template.append('/');

            if (isIdentifier(segment)) {
                template.append("{id}");
            } else {
                template.append(segment);
            }

            if (template.length() >= MAX_LENGTH) {
                break;
            }
        }

        return template.isEmpty()
            ? "/"
            : template.toString();
    }

    private String normalizePath(String rawPath) {
        String path = rawPath.trim();

        int queryIndex = path.indexOf('?');
        if (queryIndex >= 0) {
            path = path.substring(0, queryIndex);
        }

        int fragmentIndex = path.indexOf('#');
        if (fragmentIndex >= 0) {
            path = path.substring(0, fragmentIndex);
        }

        if (path.isEmpty()) {
            return "/";
        }

        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        return path;
    }

    private boolean isIdentifier(String segment) {
        return UUID_PATTERN.matcher(segment).matches()
            || NUMERIC_PATTERN.matcher(segment).matches()
            || ULID_PATTERN.matcher(segment).matches()
            || OBJECT_ID_PATTERN.matcher(segment).matches();
    }
}
