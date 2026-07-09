package com.example.Sentinel.resources.userOrgs.entity.repository;

import com.example.Sentinel.resources.userOrgs.entity.UserOrg;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserOrgRepository extends JpaRepository<UserOrg, UUID> {}
