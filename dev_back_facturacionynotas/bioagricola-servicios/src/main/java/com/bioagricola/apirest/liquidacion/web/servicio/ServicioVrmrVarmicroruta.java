package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioVrmrVarmicroruta;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IVrmrVarmicroruta;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * Vrmr_Varmicroruta
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/vrmrvarmicroruta")
public class ServicioVrmrVarmicroruta implements IVrmrVarmicroruta {

	@Autowired
	private NegocioVrmrVarmicroruta negocioVrmrVarmicroruta;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioVrmrVarmicroruta.class.getName());

}
