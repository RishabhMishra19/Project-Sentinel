package com.example.Sentinel.resources.users.entity.repository;

import com.example.Sentinel.resources.permissions.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<Permission, UUID> {}
