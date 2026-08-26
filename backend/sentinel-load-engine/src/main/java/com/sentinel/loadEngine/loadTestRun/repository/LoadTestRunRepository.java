package com.sentinel.loadEngine.loadTestRun.repository;

import com.sentinel.loadEngine.loadTestRun.entity.LoadTestRunLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LoadTestRunRepository extends JpaRepository<LoadTestRunLog, UUID> {

    @Query("Select ltr from LoadTestRunLog ltr where ltr.loadTestData.id = :loadTestDataId order by ltr.startedAt desc limit 1")
    Optional<LoadTestRunLog> findLatestRunLogForDataId(@Param("loadTestDataId") UUID loadTestDataId);
}
