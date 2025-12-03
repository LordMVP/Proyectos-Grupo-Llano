package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioPaenParametrosentradanota;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IPaenParametrosentradanota;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * Paen_Parametrosentradanotas
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/paenparametrosentradanotas")
public class ServicioPaenParametrosentradanota implements IPaenParametrosentradanota {

	@Autowired
	private NegocioPaenParametrosentradanota negocioPaenParametrosentradanota;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioPaenParametrosentradanota.class.getName());

}
