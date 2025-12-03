package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.RrbaRutarecoleccionbarridoDTO;
import com.bioagricola.apirest.modelo.entidades.RrbaRutarecoleccionbarrido;

@Service
public class NegocioRrbaRutarecoleccionbarrido
		extends NegocioAbstracto<RrbaRutarecoleccionbarrido, RrbaRutarecoleccionbarridoDTO> {


	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioRrbaRutarecoleccionbarrido.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected RrbaRutarecoleccionbarridoDTO instanciarDAO() {
		return new RrbaRutarecoleccionbarridoDTO();
	}

}
