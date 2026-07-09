package com.example.Sentinel.resources.userRoles.entity.repository;

import com.example.Sentinel.resources.orgProjects.entity.OrgProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRoleRepository extends JpaRepository<OrgProject, UUID> {}
