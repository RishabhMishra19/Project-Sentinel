package com.example.Sentinel.resources.projectEnvs.entity.repository;

import com.example.Sentinel.resources.orgProjects.entity.OrgProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectEnvRepository extends JpaRepository<OrgProject, UUID> {}
