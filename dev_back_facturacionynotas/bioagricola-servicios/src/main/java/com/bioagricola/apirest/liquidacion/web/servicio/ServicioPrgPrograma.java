package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioPrgPrograma;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IPrgPrograma;
import com.bioagricola.apirest.modelo.dtos.PrgProgramaDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * Recalmo
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/prgprograma")
public class ServicioPrgPrograma implements IPrgPrograma {

	@Autowired
	private NegocioPrgPrograma negocioPrgPrograma;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioPrgPrograma.class.getName());


	/**
	 * Método de servicio encargado de consultar la información de un programa
	 */
	@GetMapping("/consultaPrograma")
	public PrgProgramaDTO consultaPrograma(@RequestParam("idPrograma") Integer idPrograma) throws InvalidParameterException {

		return negocioPrgPrograma.consultaPrograma(idPrograma);
	}

}
