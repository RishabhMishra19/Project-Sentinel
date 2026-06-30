package com.example.Sentinel.org.repository;

import com.example.Sentinel.org.entity.Org;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface OrgRepository extends JpaRepository<Org, UUID> {

    Optional<Org> findByName(String name);

    boolean existsByName(String name);

}