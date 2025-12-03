package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioRrbaRutarecoleccionbarrido;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IRrbaRutarecoleccionbarrido;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Rrba_Rutarecoleccionbarrido
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/rrbarutarecoleccionbarrido")
public class ServicioRrbaRutarecoleccionbarrido implements IRrbaRutarecoleccionbarrido {

	@Autowired
	private NegocioRrbaRutarecoleccionbarrido negocioRrbaRutarecoleccionbarrido;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioRrbaRutarecoleccionbarrido.class.getName());

}

