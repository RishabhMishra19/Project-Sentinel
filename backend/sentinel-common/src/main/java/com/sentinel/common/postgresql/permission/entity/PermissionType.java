package com.sentinel.common.postgresql.permission.entity;

/**
 * Access level on a {@code role_scopes} row (per product / service / tenant).
 */
public enum PermissionType {
    ALL,
    READ,
    READ_AND_WRITE
}
