package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoRecaudo;
import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodoRecaudo;
import com.bioagricola.apirest.modelo.entidades.aseo.EstadoProcesado;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

public interface IManejadorAprDistRecaudoPeriodo extends ManejadorCrud<AprDistPeriodoRecaudo,Integer> {
    @Query(value = "SELECT * FROM aseo.apr_dist_periodo_recaudo WHERE estado = :estado ORDER BY rec_fecpago DESC", nativeQuery = true)
    List<AprDistPeriodoRecaudo> findByEstadoOrderedNative(@Param("estado") String estado);
    @Modifying
    @Transactional
    @Query(value = "update aseo.apr_dist_periodo_recaudo set estado = :estado where rec_fecpago in (:rec_fecpago)", nativeQuery = true)
    void updateProcesado(@Param("estado") String estado, @Param("rec_fecpago") Date rec_fecpago);

    @Modifying
    @Transactional
    @Query(value = "update aseo.apr_dist_periodo_recaudo set estado = false where rec_fecpago = :rec_fecpago", nativeQuery = true)
    void updateProcesadoFalse(Integer rec_fecpago);

    @Modifying
    @Transactional
    @Query(value = "insert into aseo.apr_dist_periodo_recaudo (rec_fecpago, estado) " +
            "SELECT DISTINCT ar.rec_fecpago, 'N' " +
            "FROM aseo.aprore_recaudoaprovechamiento ar " +
            "WHERE NOT EXISTS ( " +
            "SELECT 1 " +
            "FROM aseo.apr_dist_periodo_recaudo adpr " +
            "WHERE adpr.rec_fecpago = ar.rec_fecpago " +
            ") " +
            "AND ar.aprcons_ideregistr IS NULL", nativeQuery = true)
    void insertDistinctRecFecpagoFromAprovechamiento();

    List<AprDistPeriodoRecaudo> findAllByOrderByRecFecpagoDesc();
}
