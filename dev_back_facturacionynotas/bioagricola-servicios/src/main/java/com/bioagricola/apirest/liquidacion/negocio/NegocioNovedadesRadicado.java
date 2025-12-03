package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.modelo.dtos.NovedadesRadicadoDTO;
import com.bioagricola.apirest.modelo.entidades.NovedadesRadicado;
import com.bioagricola.apirest.modelo.manejadores.ManejadorNovedadesRadicado;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

@Service
public class NegocioNovedadesRadicado extends NegocioAbstracto<NovedadesRadicado, NovedadesRadicadoDTO> {

	@Autowired
	private ManejadorNovedadesRadicado manejadorNovedadesRadicado;

	/**
	 * Método encargado de retornar los parámetros de acción a realizar para la nota
	 * de descuento por deshabitado
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public List<NovedadesRadicadoDTO> consultaCodigoNovedad()
		{

		// Se obtiene el id de la empresa en sesión
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		List<Object[]> listaDetalle;
		List<NovedadesRadicadoDTO> listaResultados = new ArrayList<>();

		listaDetalle = manejadorNovedadesRadicado.consultaParametros(idEmpresa);

		for (Object[] row : listaDetalle) {
			NovedadesRadicadoDTO response = new NovedadesRadicadoDTO();
			response.setIdParametro((String) row[0]);
			response.setDescParametro((String) row[1]);
			listaResultados.add(response);
		}
		
		return listaResultados;
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
	protected NovedadesRadicadoDTO instanciarDAO() {
		return null;
	}

}
