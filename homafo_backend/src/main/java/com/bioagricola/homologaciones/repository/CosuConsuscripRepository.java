package com.bioagricola.homologaciones.repository;

import com.bioagricola.common.entity.CosuConsuscrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface CosuConsuscripRepository extends JpaRepository<CosuConsuscrip, Long> {

    @Query(value = "select cosu from CosuConsuscrip cosu where cosu.dsusDetsuscrip.dsusIderegistr = :idDsus")
    List<CosuConsuscrip> getAllByIdDsus(@Param("idDsus") Long idDsus);

    @Transactional
    @Modifying
    @Query(value = "delete from public.cosu_consuscrip where dsus_ideregistr=:dsusId ", nativeQuery = true)
    void deleteByDsusIderegistro(@Param("dsusId") Long dsusId);
    
    @Query(value = "select cosu from CosuConsuscrip cosu "
    		+ "where cosu.dsusDetsuscrip.dsusIderegistr = :idDsus and cosu.cosuEstado = 'A' and cosu.uniConcepto in (:conceptos_marcacion) ")
    List<CosuConsuscrip> getAllByIdDsusConcepto(@Param("idDsus") Long idDsus, @Param("conceptos_marcacion") List<Long> conceptos_marcacion);
    
    @Transactional
    @Modifying
    @Query(value = "delete from public.cosu_consuscrip where dsus_ideregistr=:dsusId and uni_concepto=:concepto", nativeQuery = true)
    int deleteByDsusIderegistroAndConcepto(@Param("dsusId") Long dsusId,@Param("concepto") Integer concepto);

}
