package com.bioagricola.apirest.modelo.manejadores;

import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.entidades.CuapCuentaAprovechamiento;
import com.bioagricola.apirest.modelo.manejadores.utils.IManejadorCrud;
import com.bioagricola.apirest.modelo.manejadores.utils.ManejadorCrud;

@Service
public interface ManejadorCuapCuentaAprovechamiento 
extends ManejadorCrud<CuapCuentaAprovechamiento, Integer>, IManejadorCrud<CuapCuentaAprovechamiento, Integer> {
	
}
