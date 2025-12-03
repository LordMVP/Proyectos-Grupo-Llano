package com.bioagricola.apirest.liquidacion.negocio;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.apirest.liquidacion.security.JwtUtil;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.ParParametroDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoIndicadoresCalidadDTO;
import com.bioagricola.apirest.modelo.entidades.DperDetperiodo;
import com.bioagricola.apirest.modelo.entidades.ParParametro;
import com.bioagricola.apirest.modelo.entidades.PerPeriodo;
import com.bioagricola.apirest.modelo.manejadores.ManejadorEstEstructura;
import com.bioagricola.apirest.modelo.manejadores.ManejadorParParametro;
import com.bioagricola.apirest.modelo.manejadores.ManejadorPerPeriodo;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class NegocioParParametro extends NegocioAbstracto<ParParametro, ParParametroDTO> {

	@Autowired
	private ManejadorParParametro manejadorParParametro;

	@Autowired
	private ManejadorEstEstructura manejadorEstEstructura;

	@Autowired
	private ManejadorPerPeriodo manejadorPerPeriodo;

	/**
	 * Método encargado de retornar los parámetros de acción a realizar para la nota
	 * de descuento por deshabitado
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public List<ParParametroDTO> consultaParametrosAccionDeshabitado()
			throws IOException {
		// Se obtiene el id de la empresa en sesión
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);
		List<ParParametroDTO> listaResultados = new ArrayList<>();

		// Se mapean en DTO's y se añaden a una lista para ser mostrados en una lista
		// desplegable en la aplicación
		ParParametroDTO parametro1 = new ParParametroDTO(
				(Integer) (consulta.get(ConstantesServicios.DESHABITADO_RETROACTIVO)),
				ConstantesServicios.DESHABITADO_RETROACTIVO_DESCRIPCION);

		ParParametroDTO parametro2 = new ParParametroDTO(
				(Integer) (consulta.get(ConstantesServicios.TARIFA_DESHABITADO)),
				ConstantesServicios.TARIFA_DESHABITADO_DESCRIPCION);

		listaResultados.add(parametro1);
		listaResultados.add(parametro2);

		return listaResultados;
	}

	/**
	 * Método encargado de consultar los parámetros según la empresa en sesión y de
	 * retornar un map, para luego según la necesidad obtener el valor de alguno/s
	 * de los parámetros
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public Map<String, Object> consultaParametros(int idEmpresa, String parametroAConsultar)
			throws  IOException {
		// Se obtiene de la tabla Par_parametros el valor de los parametros definidos
		// para la empresa en sesión
		ParParametro parametrosEmpresa = manejadorParParametro.consultaParametros(idEmpresa);
		// Se mapea el json que se recibe de la consulta en un hash map para acceder a
		// sus valores más fácilmente
		Map<String, Object> parametros = new ObjectMapper().readValue(parametrosEmpresa.getParParametro(),
				HashMap.class);
		// Se obtienen los valores de los parametros

		return (Map<String, Object>) parametros.get(parametroAConsultar);

	}

	/**
	 * Método encargado de retornar los parámetros de acción a realizar para la nota
	 * de descuento por deshabitado
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public List<ParParametroDTO> consultaParametrosNota(String claseNota)
			throws IOException {
		// Se obtiene el id de la empresa en sesión
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);

		List<Object[]> listaDetalle;
		List<ParParametroDTO> listaResultados = new ArrayList<>();

		// Se mapean el DTO's para buscar con la clase los datos del desplegable
		ParParametroDTO claseTipoNota = new ParParametroDTO((Integer) (consulta.get(claseNota)), claseNota);

		listaDetalle = manejadorEstEstructura.consultaTipoNota(idEmpresa, claseTipoNota.getIdParametro());

		for (Object[] row : listaDetalle) {
			ParParametroDTO response = new ParParametroDTO();
			response.setDescParametro((String) row[0]);
			response.setIdParametro((Integer) row[1]);
			listaResultados.add(response);
		}

		return listaResultados;
	}

	/**
	 * Método encargado de retornar los parámetros de acción a realizar para la nota
	 * de descuento por deshabitado
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public List<PeriodoIndicadoresCalidadDTO> consultaPeriodoIndicadorCalidad(String claseNota)
			throws IOException {
		// Se obtiene el id de la empresa en sesión
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);

		List<PerPeriodo> lista;
		List<PeriodoIndicadoresCalidadDTO> listaResultados = new ArrayList<>();

		// Se mapean el DTO's para buscar con la clase los datos del desplegable
		ParParametroDTO claseTipoNota = new ParParametroDTO((Integer) (consulta.get(claseNota)), claseNota);

		lista = manejadorPerPeriodo.consultarPeriodoDescCalidad(claseTipoNota.getIdParametro(), null);

		PeriodoIndicadoresCalidadDTO response = new PeriodoIndicadoresCalidadDTO();
		if (!lista.isEmpty()) {
			response.setNombrePeriodo(lista.get(0).getPerNombre());
			response.setIdPeriodo(lista.get(0).getPerIderegistro());
		}
		listaResultados.add(response);

		return listaResultados;
	}

	/**
	 * Método encargado de retornar los parámetros de acción a realizar para la nota
	 * de descuento por deshabitado
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public Boolean habilitarPeriodoIndicadorCalidad(String claseNota, Integer idPeriodo)
			throws  IOException {
		// Se obtiene el id de la empresa en sesión
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();
		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);

		List<PeriodoIndicadoresCalidadDTO> listaResultados = new ArrayList<>();

		// Se mapean el DTO's para buscar con la clase los datos del desplegable
		ParParametroDTO claseTipoNota = new ParParametroDTO((Integer) (consulta.get(claseNota)), claseNota);

		List<DperDetperiodo> lista = manejadorPerPeriodo.consultarEstadoPeriodo(claseTipoNota.getIdParametro(),
				idPeriodo);
		if (!lista.isEmpty()) {
			PeriodoIndicadoresCalidadDTO response = new PeriodoIndicadoresCalidadDTO();
			response.setNombrePeriodo(lista.get(0).getDperEstado());
			response.setIdPeriodo(lista.get(0).getDperIderegistr());
			listaResultados.add(response);

		}
		return !listaResultados.get(0).getNombrePeriodo().equals("C");
	}

	/**
	 * Método encargado de manejar la lógica de la consulta del parámetro de holgura
	 * según la empresa en sesión
	 * 
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	public Integer consultaHolguraInicioVigencia() throws  IOException {
		int idEmpresa = JwtUtil.auditoriaDTO.getIdEmpresa();

		Map<String, Object> consulta = this.consultaParametros(idEmpresa, ConstantesServicios.UNIDAD_LIQUIDACION_NOTAS);

		return (Integer) consulta.get(ConstantesServicios.HOLGURA_VIGENCIA_DESDE_NOTAS);
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
	protected ParParametroDTO instanciarDAO() {
		return new ParParametroDTO();
	}

}
