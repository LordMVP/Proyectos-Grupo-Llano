package com.bioagricola.apirest.aprovechamiento.negocio;

import com.bioagricola.apirest.aprovechamiento.security.JwtUtil;
import com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.ParParametroDTO;
import com.bioagricola.apirest.modelo.entidades.ParParametro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorParParametro;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class NegocioParParametro extends NegocioAbstracto<ParParametro, ParParametroDTO> {

	@Autowired
	private ManejadorParParametro manejadorParParametro;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(NegocioParParametro.class.getName());

	/**
	 * Método encargado de retornar los parámetros de aprovechamiento
	 *
	 * @return Map<String, String>
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public Map<String, Object> consultaParametrosAprovechamiento()
			throws JsonParseException, JsonMappingException, IOException {

		// Se obtiene el id de la empresa en sesión
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_APROVECHAMIENTO);

		return consulta;
	}

	/**
	 * Método encargado de consultar los parámetros según la empresa en sesión 
	 * y de retornar un map, para luego según la necesidad obtener el valor
	 * de alguno/s de los parámetros
	 *
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public Map<String, Object> consultaParametros(int idEmpresa, String parametroAConsultar) throws JsonParseException, JsonMappingException, IOException {
		// Se obtiene de la tabla Par_parametros el valor de los parametros definidos
		// para la empresa en sesión
		ParParametro parametrosEmpresa = manejadorParParametro.consultaParametros(idEmpresa);

		// Se mapea el json que se recibe de la consulta en un hash map para acceder a
		// sus valores más fácilmente
		Map<String, Object> parametros = new ObjectMapper().readValue(parametrosEmpresa.getParParametro(), HashMap.class);

		// Se obtienen los valores de los parametros
		return (Map<String, Object>) parametros.get(parametroAConsultar);
	}

	@Override
	protected boolean entidadContieneAtributo(String nombreAtributo) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	protected Logger getLogger() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected ParParametroDTO instanciarDAO() {
		// TODO Auto-generated method stub
		return new ParParametroDTO();
	}

}
