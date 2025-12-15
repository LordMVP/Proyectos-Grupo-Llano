package com.bioagricola.apirest.modelo.manejadores;

import com.bioagricola.apirest.modelo.entidades.aseo.AprProyeccionSubContrib;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IManejadorAprProyeccionSubContrib extends ManejadorCrud<AprProyeccionSubContrib, Long> {
    List<AprProyeccionSubContrib> findAllByOrderByAnioAscEstratoAsc();
    List<AprProyeccionSubContrib> findByAnio(Integer anio);
    List<AprProyeccionSubContrib> findByEsActualTrue();
}