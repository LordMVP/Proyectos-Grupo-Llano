package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.VrmrVarmicrorutaDTO;
import com.bioagricola.apirest.modelo.entidades.VrmrVarmicroruta;

@Service
public class NegocioVrmrVarmicroruta extends NegocioAbstracto<VrmrVarmicroruta, VrmrVarmicrorutaDTO> {


	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioVrmrVarmicroruta.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected VrmrVarmicrorutaDTO instanciarDAO() {
		return new VrmrVarmicrorutaDTO();
	}

}
