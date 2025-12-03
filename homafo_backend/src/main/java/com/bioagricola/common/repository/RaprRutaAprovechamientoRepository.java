package com.bioagricola.common.repository;

import com.bioagricola.common.entity.RaprRutaAprovechamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RaprRutaAprovechamientoRepository extends JpaRepository<RaprRutaAprovechamiento, Long> {

    @Query(value = "select rrb from RaprRutaAprovechamiento rrb where rrb.dsusDetsuscrip.dsusIderegistr = :dsusId and rrb.rutEstado = 'A'")
    Optional<RaprRutaAprovechamiento> findByDsusDetsuscripId(@Param("dsusId") Long dsusId);

    RaprRutaAprovechamiento findByDsusDetsuscrip_DsusIderegistr(Long dsusId);
}
