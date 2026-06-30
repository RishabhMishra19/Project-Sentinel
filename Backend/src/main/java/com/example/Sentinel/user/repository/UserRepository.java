package com.example.Sentinel.user.repository;

import com.example.Sentinel.user.entity.User;
import com.example.Sentinel.user.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByOrgId(UUID orgId);

}
