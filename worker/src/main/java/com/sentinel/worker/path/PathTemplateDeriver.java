package com.sentinel.worker.path;

import java.util.Locale;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class PathTemplateDeriver {

    private static final Pattern UUID_SEGMENT = Pattern.compile(
            "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");
    private static final Pattern NUMERIC_SEGMENT = Pattern.compile("^\\d+$");
    private static final int MAX_LENGTH = 512;

    public String derive(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            return "/";
        }

        String path = rawPath.trim();
        int queryIdx = path.indexOf('?');
        if (queryIdx >= 0) {
            path = path.substring(0, queryIdx);
        }
        int fragmentIdx = path.indexOf('#');
        if (fragmentIdx >= 0) {
            path = path.substring(0, fragmentIdx);
        }
        if (path.isBlank()) {
            return "/";
        }
        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        String[] segments = path.split("/", -1);
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < segments.length; i++) {
            String segment = segments[i];
            if (i > 0) {
                out.append('/');
            }
            if (segment.isEmpty()) {
                continue;
            }
            if (UUID_SEGMENT.matcher(segment).matches() || NUMERIC_SEGMENT.matcher(segment).matches()) {
                out.append("{id}");
            } else {
                out.append(segment);
            }
        }

        String template = out.isEmpty() ? "/" : out.toString();
        if (!template.startsWith("/")) {
            template = "/" + template;
        }
        if (template.length() > MAX_LENGTH) {
            template = template.substring(0, MAX_LENGTH);
        }
        return template;
    }

    public String normalizeMethod(String method) {
        if (method == null || method.isBlank()) {
            return "GET";
        }
        return method.trim().toUpperCase(Locale.ROOT);
    }
}
