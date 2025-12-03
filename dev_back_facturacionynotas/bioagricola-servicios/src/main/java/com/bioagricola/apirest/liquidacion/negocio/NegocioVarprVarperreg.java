package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.modelo.dtos.VarprVarperregDTO;
import com.bioagricola.apirest.modelo.entidades.VarprVarperreg;

@Service
public class NegocioVarprVarperreg extends NegocioAbstracto<VarprVarperreg, VarprVarperregDTO> {


	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioVarprVarperreg.class.getName());

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		return false;
	}

	@Override
	protected Logger getLogger() {
		return logger;
	}

	@Override
	protected VarprVarperregDTO instanciarDAO() {
		return new VarprVarperregDTO();
	}

}
