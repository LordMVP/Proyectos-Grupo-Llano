package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.PrunPrgunidadDTO;
import com.bioagricola.apirest.modelo.entidades.PrunPrgunidad;

@Service
public class NegocioPrunPrgunidad extends NegocioAbstracto<PrunPrgunidad, PrunPrgunidadDTO> {

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return null;
	}

	@Override
	protected PrunPrgunidadDTO instanciarDAO() {
		return null;
	}

}
