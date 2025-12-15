package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoFacturacion;
import com.bioagricola.apirest.modelo.entidades.aseo.AprDistPeriodoRecaudo;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface IManejadorAprDistSubsidiosContribuciones extends ManejadorCrud<AprDistPeriodoFacturacion,Integer> {
   /*
   CREATE OR REPLACE PROCEDURE aseo.sp_procesar_subsidios_rango_periodos(
    p_periodo_inicio INTEGER,
    p_periodo_fin INTEGER
) execut    e
    */
    @Modifying
    @Transactional
    @Query(value = "CALL aseo.sp_procesar_subsidios_rango_periodos(:p_periodo_inicio, :p_periodo_fin)", nativeQuery = true)
    void procesarSubsidiosRangoPeriodos(@Param("p_periodo_inicio") Integer periodoInicio,
                                         @Param("p_periodo_fin") Integer periodoFin);
    @Modifying
    @Transactional
    @Query(value = "SELECT aseo.fn_procesar_subsidios_periodo_simple(:p_periodo)", nativeQuery = true)
    Integer procesarSubsidiosPeriodoSimple(@Param("p_periodo") Integer periodo);
}
