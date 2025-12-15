package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprGirosMunicipio;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IManejadorAprGirosMunicipio extends ManejadorCrud<AprGirosMunicipio, Integer> {
    List<AprGirosMunicipio> findAllByOrderByFechaPagoDesc();
    List<AprGirosMunicipio> findByFechaPagoBetween(LocalDate fechaInicio, LocalDate fechaFin);
    List<AprGirosMunicipio> findByUsuarioRegistro(String usuarioRegistro);
}
