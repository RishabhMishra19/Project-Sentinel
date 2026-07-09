package com.example.Sentinel.resources.envApiKeys.repository;

import com.example.Sentinel.resources.envApiKeys.entity.EnvApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EnvApiKeyRepository extends JpaRepository<EnvApiKey, UUID> {}
