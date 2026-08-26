package com.sentinel.loadEngine.loadTestData.repository;

import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LoadTestDataRepository extends JpaRepository<LoadTestData, UUID> {

}
