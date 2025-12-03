package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioAfoAforo;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IAfoAforo;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad afo_aforo
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/afoaforo")
public class ServicioAfoAforo implements IAfoAforo {

	@Autowired
	private NegocioAfoAforo negocioAfoAforo;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioAfoAforo.class.getName());

}
