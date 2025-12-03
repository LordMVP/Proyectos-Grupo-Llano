package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioHmafHistormaestroaforo;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IHmafHistormaestroaforo;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Hmaf_Histormaestroaforo
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/hmafhistormaestroaforo")
public class ServicioHmafHistormaestroaforo implements IHmafHistormaestroaforo {

	@Autowired
	private NegocioHmafHistormaestroaforo negocioHmafHistormaestroaforo;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioHmafHistormaestroaforo.class.getName());

}
