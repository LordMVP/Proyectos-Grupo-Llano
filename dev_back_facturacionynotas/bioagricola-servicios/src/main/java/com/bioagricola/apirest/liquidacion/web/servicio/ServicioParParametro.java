package com.bioagricola.apirest.liquidacion.web.servicio;

import java.io.IOException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioParParametro;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IParParametro;
import com.bioagricola.apirest.liquidacion.web.servicio.utils.ConstantesServicios;
import com.bioagricola.apirest.modelo.dtos.ParParametroDTO;
import com.bioagricola.apirest.modelo.dtos.PeriodoIndicadoresCalidadDTO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * Recalmo
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/parparametro")
public class ServicioParParametro implements IParParametro {

	@Autowired
	private NegocioParParametro negocioParParametro;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioParParametro.class.getName());


	/**
	 * Método de servicio encargado de consultar los parámetros de acción a realizar
	 */
	@GetMapping("/consultaAccionesDeshabitado")
	public List<ParParametroDTO> consultaParametrosAccionDeshabitado() throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.consultaParametrosAccionDeshabitado();
	}
	
	/**
	 * Método de servicio encargado de consultar los parámetros de tipo de nota
	 */
	@GetMapping("/consultaTipoNota")
	public List<ParParametroDTO> consultaParametrosTipoNota() throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.consultaParametrosNota(ConstantesServicios.CLASE_TIPO_NOTAS);
	}
	
	/**
	 * Método de servicio encargado de consultar los parámetros de motivo de nota
	 */
	@GetMapping("/consultaMotivoNota")
	public List<ParParametroDTO> consultaParametrosMotivoNota() throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.consultaParametrosNota(ConstantesServicios.CLASE_MOTIVO_NOTA);
	}
	
	/**
	 * Método de servicio encargado de consultar el periodo para el indicador de calidad
	 */
	@GetMapping("/consultaPeriodoIndicadorCalidad")
	public List<PeriodoIndicadoresCalidadDTO> consultaPeriodoIndicadorCalidad() throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.consultaPeriodoIndicadorCalidad(ConstantesServicios.CICLO_SEMESTRAL_INDICADOR_CALIDAD);
	}

	/**
	 * Método de servicio encargado de consultar el periodo para el indicador de calidad
	 */
	@GetMapping("/habilitarPeriodoIndicadorCalidad")
	public Boolean habilitarPeriodoIndicadorCalidad(Integer idPeriodo) throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.habilitarPeriodoIndicadorCalidad(ConstantesServicios.ID_PROGRAMA_PROCESA_INDICADORES_CALIDAD, idPeriodo);
	}
	
	/**
	 * Método encargado de consultar la holgura de inicio de vigencia para la marcación a futuro según
	 * la empresa en sesión
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	@GetMapping("/consultaHolgIniVigen")
	public Integer consultaHolguraInicioVigencia() throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.consultaHolguraInicioVigencia();
	}

}
