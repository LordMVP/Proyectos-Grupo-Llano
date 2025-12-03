package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioDafoDetaforo;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IDafoDetaforo;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * Dafo_Detaforo
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/dafodetaforo")
public class ServicioDafoDetaforo implements IDafoDetaforo {

	@Autowired
	private NegocioDafoDetaforo negocioDafoDetaforo;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioDafoDetaforo.class.getName());

}
