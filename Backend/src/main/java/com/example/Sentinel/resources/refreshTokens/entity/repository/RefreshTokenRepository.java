package com.example.Sentinel.resources.refreshTokens.entity.repository;

import com.example.Sentinel.resources.orgProjects.entity.OrgProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<OrgProject, UUID> {}
