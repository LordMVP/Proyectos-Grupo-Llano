package com.bioagricola.common.repository;

import com.bioagricola.common.entity.DicnDisconven;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DicnDisconvenRepository extends JpaRepository<DicnDisconven, Long> {
    @Query(value = "select distinct (dd.empIderegistro) from DicnDisconven dd where dd.cnreCnvrecaudo.cnreIderegistr = :cnrId")
    List<Long> findAllByCnreCnvrecaudo(@Param("cnrId") Long cnrId);
}
