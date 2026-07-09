package com.example.Sentinel.resources.permissions.entity.repository;

import com.example.Sentinel.resources.orgProjects.entity.OrgProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PermissionRepository extends JpaRepository<OrgProject, UUID> {}
