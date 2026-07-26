package com.sentinel.server.analytics.dto.response;

public record StatusBreakdownItem(int statusCode, long requestCount) {}
