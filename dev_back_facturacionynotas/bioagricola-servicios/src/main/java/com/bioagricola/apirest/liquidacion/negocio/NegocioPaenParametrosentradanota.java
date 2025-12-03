package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.PaenParametrosentradanotaDTO;
import com.bioagricola.apirest.modelo.entidades.PaenParametrosentradanota;

@Service
public class NegocioPaenParametrosentradanota
		extends NegocioAbstracto<PaenParametrosentradanota, PaenParametrosentradanotaDTO> {

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioPaenParametrosentradanota.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected PaenParametrosentradanotaDTO instanciarDAO() {
		return new PaenParametrosentradanotaDTO();
	}

}
