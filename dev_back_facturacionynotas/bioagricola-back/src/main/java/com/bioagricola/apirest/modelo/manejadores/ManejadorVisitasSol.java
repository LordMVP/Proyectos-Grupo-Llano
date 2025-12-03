package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.VisitasSol;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorVisitasSol extends ManejadorCrud<VisitasSol, Long>, IManejadorCrud<VisitasSol, String> {

}
