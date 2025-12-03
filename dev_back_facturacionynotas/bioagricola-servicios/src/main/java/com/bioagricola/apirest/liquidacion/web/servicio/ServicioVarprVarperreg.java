package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioVarprVarperreg;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IVarprVarperreg;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Varpr_Varprreg
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/varprvarperreg")
public class ServicioVarprVarperreg implements IVarprVarperreg {

	@Autowired
	private NegocioVarprVarperreg negocioVarprVarperreg;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioVarprVarperreg.class.getName());

}

