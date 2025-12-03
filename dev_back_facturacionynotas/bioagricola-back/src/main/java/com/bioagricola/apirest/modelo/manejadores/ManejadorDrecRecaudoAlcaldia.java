package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.DetRecaudoAlcaldiaIat;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ManejadorDrecRecaudoAlcaldia
 */
@Service
public interface ManejadorDrecRecaudoAlcaldia extends ManejadorCrud<DetRecaudoAlcaldiaIat, Integer>,
        IManejadorCrud<DetRecaudoAlcaldiaIat, Integer> {

    @Query(value = "select ra.* from aseo.dreciat_detalle_recaudo_iat ra " +
            "where ra.ter_ideregistro = :tercero " +
            "and ra.fecha_corte between :fecha_inicio and :fecha_fin ", nativeQuery = true)
    Optional<DetRecaudoAlcaldiaIat> obtenerDetalleRecaudoPeriodoAnterior(@Param("tercero") Integer tercero,
                                                                         @Param("fecha_inicio") Date fechaIni,
                                                                         @Param("fecha_fin") Date fechaFin);
}
