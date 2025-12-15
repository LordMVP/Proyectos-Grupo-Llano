package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprSincPeriodoRecaudo;
import com.bioagricola.apirest.modelo.entidades.aseo.EstadoProcesado;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public interface IManejadorAprSincRecaudoPeriodo extends ManejadorCrud<AprSincPeriodoRecaudo,Long> {


    @Modifying
    @Transactional
    @Query(value = "update aseo.apr_sinc_periodo_recaudo set estado = :estado where id in (:id)", nativeQuery = true)
    void updateProcesado(@Param("estado") String estado, @Param("id") List<Long> id);

    @Query(value = "SELECT * FROM aseo.apr_sinc_periodo_recaudo WHERE estado = :estado ORDER BY fecha_pago DESC", nativeQuery = true)
    List<AprSincPeriodoRecaudo> findByEstadoOrderByRecFecpago(@Param("estado") String estado);


    @Query("SELECT a FROM AprSincPeriodoRecaudo a ORDER BY a.fechaPago DESC")
    List<AprSincPeriodoRecaudo> getAllOrderedByRecFecpagoDesc();

    @Modifying
    @Transactional
    @Query(value = "CALL aseo.insert_apr_sinc_periodo_recaudo()", nativeQuery = true)
    void insertAprSincPeriodoRecaudo();
}
