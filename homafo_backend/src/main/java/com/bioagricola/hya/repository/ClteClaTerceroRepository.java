package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.ClteClatercero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClteClaTerceroRepository extends JpaRepository<ClteClatercero, Long> {

    @Query(value = "select cc from ClteClatercero cc where cc.terTercero.terIderegistro = :terId")
    List<ClteClatercero> findByTerIderegistro(@Param("terId") Long terId);

    @Modifying(flushAutomatically = true)
    @Query("delete from ClteClatercero cc where cc.clteIderegistr in (:ids)")
    void deleteAllByIds(@Param("ids") List<Long> ids);
}
