package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.LidsLiqdetsus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface LidsLiqdetsusRepository extends JpaRepository<LidsLiqdetsus, Long> {

    @Modifying
    @Transactional
    @Query(value = "update LidsLiqdetsus l set l.uniLiquidacion=:uniLiquidacion where l.dsusIderegistr=:dsusId")
    void updateLidsByDsus(Integer uniLiquidacion, Long dsusId);

}
