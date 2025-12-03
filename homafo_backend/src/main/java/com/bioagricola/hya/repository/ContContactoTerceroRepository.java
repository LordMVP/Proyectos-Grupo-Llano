package com.bioagricola.hya.repository;

import com.bioagricola.common.entity.ContContactotercero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContContactoTerceroRepository extends JpaRepository<ContContactotercero, Long> {

    @Query(value = "select cc from ContContactotercero cc where cc.terTercero.terIderegistro = :terceroId")
    List<ContContactotercero> findAllByTerceroId(@Param("terceroId") Long terceroId);

    @Modifying(flushAutomatically = true)
    @Query("delete from ContContactotercero cc where cc.contIderegistro in (:ids)")
    void deleteAllByIds(@Param("ids") List<Long> ids);
}
