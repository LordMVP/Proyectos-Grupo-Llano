package com.bioagricola.apirest.aprovechamiento.servicio;

import com.bioagricola.apirest.aprovechamiento.negocio.NegocioParParametro;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IParParametro;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

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
	 * Método de servicio encargado de consultar los parámetros para liquidar pago aprovechador
	 */
	@GetMapping("/consultaParametrosAprovechamiento")
	public Map<String, Object> consultaParametrosAprovechamiento() throws JsonParseException, JsonMappingException, IOException {

		return negocioParParametro.consultaParametrosAprovechamiento();
	}
	
}
