package com.bioagricola.hya.repository;

import com.bioagricola.hya.entity.ArclogSincArcgisLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ArclogSincArcgisLogRepository extends JpaRepository<ArclogSincArcgisLog,Integer> {

    @Query(value = "SELECT now()", nativeQuery = true)
    LocalDateTime getCurrentDateTime();

}
