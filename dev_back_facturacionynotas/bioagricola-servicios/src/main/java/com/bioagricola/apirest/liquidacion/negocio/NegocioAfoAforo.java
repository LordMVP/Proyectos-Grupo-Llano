package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.AfoAforoDTO;
import com.bioagricola.apirest.modelo.entidades.AfoAforo;

@Service
public class NegocioAfoAforo extends NegocioAbstracto<AfoAforo, AfoAforoDTO> {


	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioAfoAforo.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected AfoAforoDTO instanciarDAO() {
		return new AfoAforoDTO();
	}

}
