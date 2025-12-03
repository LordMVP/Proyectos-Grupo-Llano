package com.bioagricola.common.repository;

import com.bioagricola.common.entity.CnreCnvrecaudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CnreCnvrecaudoRepository extends JpaRepository<CnreCnvrecaudo, Long> {
    @Query(value = "select cc from CnreCnvrecaudo cc join DicnDisconven dd " +
            "on(cc.cnreIderegistr = dd.cnreCnvrecaudo.cnreIderegistr) where cc.cnreNombre = :name and dd.empIderegistro = :empId")
    Optional<CnreCnvrecaudo> findByNameAndEmpId(@Param("name") String name, @Param("empId") Long empId);

    @Query(value = "select distinct (cc) from CnreCnvrecaudo cc join DicnDisconven dd " +
            "on(cc.cnreIderegistr = dd.cnreCnvrecaudo.cnreIderegistr) where dd.empIderegistro = :empId")
    List<CnreCnvrecaudo> findAllByEmpId(@Param("empId") Long empId);

    @Query(value = "select c.cnreNombre from CnreCnvrecaudo c where c.cnreIderegistr=:cnreIderegistro")
    String findNameCnreById(Long cnreIderegistro);
}
