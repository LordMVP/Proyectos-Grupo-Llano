package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.DafoDetaforoDTO;
import com.bioagricola.apirest.modelo.entidades.DafoDetaforo;

@Service
public class NegocioDafoDetaforo extends NegocioAbstracto<DafoDetaforo, DafoDetaforoDTO> {


	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioDafoDetaforo.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected DafoDetaforoDTO instanciarDAO() {
		return new DafoDetaforoDTO();
	}

}
