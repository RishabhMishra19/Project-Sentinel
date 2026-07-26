package com.sentinel.server.analytics.dto.response;

public record ExceptionMetricItem(String exceptionType, long exceptionCount) {}
