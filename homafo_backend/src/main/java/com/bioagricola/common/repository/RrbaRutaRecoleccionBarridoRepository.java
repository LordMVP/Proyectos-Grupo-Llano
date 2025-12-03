package com.bioagricola.common.repository;

import com.bioagricola.common.entity.RrbaRutaRecoleccionBarrido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RrbaRutaRecoleccionBarridoRepository extends JpaRepository<RrbaRutaRecoleccionBarrido, Long> {

    @Query(value = "select rrb from RrbaRutaRecoleccionBarrido rrb join rrb.rutRuta as rut where rrb.dsusDetsuscrip.dsusIderegistr = :dsusId and rut.uniTiporuta.uniIderegistro=:uniTypeRoute")
    RrbaRutaRecoleccionBarrido findByDsusDetsuscripId(@Param("dsusId") Long dsusId,@Param("uniTypeRoute") Long uniTypeRoute);
}
