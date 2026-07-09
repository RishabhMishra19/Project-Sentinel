package com.example.Sentinel.resources.auditLogs.repository;

import com.example.Sentinel.resources.auditLogs.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {}
