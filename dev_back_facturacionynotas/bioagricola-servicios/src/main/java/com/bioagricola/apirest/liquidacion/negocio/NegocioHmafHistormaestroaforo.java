package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.HmafHistormaestroaforoDTO;
import com.bioagricola.apirest.modelo.entidades.HmafHistormaestroaforo;

@Service
public class NegocioHmafHistormaestroaforo extends NegocioAbstracto<HmafHistormaestroaforo, HmafHistormaestroaforoDTO> {


	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioHmafHistormaestroaforo.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected HmafHistormaestroaforoDTO instanciarDAO() {
		return new HmafHistormaestroaforoDTO();
	}

}
