package com.example.Sentinel.resources.orgs.entity.repository;

import com.example.Sentinel.resources.orgs.entity.Org;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrgRepository extends JpaRepository<Org, UUID> {}
