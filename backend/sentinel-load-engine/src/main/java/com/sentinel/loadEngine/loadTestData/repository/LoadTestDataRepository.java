package com.sentinel.loadEngine.loadTestData.repository;

import com.sentinel.loadEngine.loadTestData.dto.LoadTestDataWithLatestRun;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LoadTestDataRepository extends JpaRepository<LoadTestData, UUID> {

    @Query("""
            SELECT new com.sentinel.loadEngine.loadTestData.dto.LoadTestDataWithLatestRun(d, r)
            FROM LoadTestData d
            LEFT JOIN LoadTestRunLog r
                ON r.loadTestData.id = d.id
                AND r.startedAt = (
                    SELECT MAX(r2.startedAt)
                    FROM LoadTestRunLog r2
                    WHERE r2.loadTestData.id = d.id
                )
        """)
    List<LoadTestDataWithLatestRun> findLoadTestDataListWithLatestRuns();

}
