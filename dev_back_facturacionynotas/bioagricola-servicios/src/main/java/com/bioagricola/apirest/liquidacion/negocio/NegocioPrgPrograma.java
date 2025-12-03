package com.bioagricola.apirest.liquidacion.negocio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.PrgProgramaDTO;
import com.bioagricola.apirest.modelo.entidades.PrgPrograma;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPrgPrograma;

@Service
public class NegocioPrgPrograma extends NegocioAbstracto<PrgPrograma, PrgProgramaDTO> {

	@Autowired
	private ManejadorPrgPrograma manejadorPrgPrograma;


	/**
	 * Método de negocio para manejar los parametro al consultar la información de un programa
	 * 
	 * @param idPrograma
	 * @return
	 */
	public PrgProgramaDTO consultaPrograma(Integer idPrograma) {
		
		int idUsusario = JwtUtil.auditoriaDTO.getIdUsuario();
		
		PrgPrograma programa = manejadorPrgPrograma.consultaPrograma(idPrograma, idUsusario);
		
		return convertirEntidadADao(programa);
	}
	
	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {

		return false;
	}

	@Override
	protected Logger getLogger() {

		return null;
	}

	@Override
	protected PrgProgramaDTO instanciarDAO() {

		return null;
	}

}
