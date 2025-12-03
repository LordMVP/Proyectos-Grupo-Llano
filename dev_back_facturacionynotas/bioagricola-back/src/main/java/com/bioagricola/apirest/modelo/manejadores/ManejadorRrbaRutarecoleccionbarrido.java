package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.RrbaRutarecoleccionbarrido;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorRrbaRutarecoleccionbarrido extends ManejadorCrud<RrbaRutarecoleccionbarrido, Integer>,
		IManejadorCrud<RrbaRutarecoleccionbarrido, Integer> {

}
