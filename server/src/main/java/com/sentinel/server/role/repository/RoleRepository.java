package com.sentinel.server.role.repository;

import com.sentinel.server.role.entity.Role;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, UUID> {
}
