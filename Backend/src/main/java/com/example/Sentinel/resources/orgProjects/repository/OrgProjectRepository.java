package com.example.Sentinel.resources.orgProjects.repository;

import com.example.Sentinel.resources.orgProjects.entity.OrgProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrgProjectRepository extends JpaRepository<OrgProject, UUID> {}
