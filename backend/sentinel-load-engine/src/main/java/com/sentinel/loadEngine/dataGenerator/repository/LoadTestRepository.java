package com.sentinel.loadEngine.dataGenerator.repository;

import com.sentinel.loadEngine.dataGenerator.entity.LoadTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.UUID;

@Repository
public interface LoadTestRepository extends JpaRepository<LoadTest, UUID>, Serializable {

}
