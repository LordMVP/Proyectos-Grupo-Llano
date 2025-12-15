package com.bioagricola.apirest.liquidacion.web.servicio;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioDecaDesccalidad;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IDecaDesccalidad;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadRecolAprobDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadRecolAprobRespuestaDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseDescuentosCalidadRecolDTO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Deca_Desccalidad
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/decadesccalidad")
public class ServicioDecaDesccalidad implements IDecaDesccalidad {

	@Autowired
	private NegocioDecaDesccalidad negocioDecaDesccalidad;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioDecaDesccalidad.class.getName());

	/**
	 * Método para procesar el descuento por indicadores de calidad para unas
	 * suscripciones
	 * 
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	@GetMapping("/descuentoCalidad")
	public ResponseDescuentosCalidadRecolDTO aplicarDescCalidad() throws JsonParseException, JsonMappingException, IOException {
		return negocioDecaDesccalidad.aplicarDescCalidad();
	}
        
        @PostMapping("/aprobacionDescuentosCalidad")
	public ResponseDescuentosCalidadRecolAprobRespuestaDTO aprobarDescCalidad(@RequestBody ResponseDescuentosCalidadRecolAprobDTO respuesta) throws IOException{
		return negocioDecaDesccalidad.aprobarDescCalidad(respuesta);
	}

}
