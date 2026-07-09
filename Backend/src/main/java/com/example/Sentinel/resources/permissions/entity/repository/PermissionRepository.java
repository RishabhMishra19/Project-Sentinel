package com.example.Sentinel.resources.permissions.entity.repository;

import com.example.Sentinel.resources.permissions.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {

    @Query("""
    SELECT p
    FROM Permission p
    JOIN RolePermission rp ON rp.permission = p
    JOIN UserRole ur ON ur.role = rp.role
    WHERE ur.user.id = :userId
    AND ur.status = 'ACTIVE'
    AND rp.status = 'ACTIVE'
    AND p.status = 'ACTIVE'
    """)
    List<Permission> findPermissionsByUserId(UUID userId);
}
