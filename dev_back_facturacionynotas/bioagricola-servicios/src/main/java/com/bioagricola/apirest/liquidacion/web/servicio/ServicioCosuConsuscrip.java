package com.bioagricola.apirest.liquidacion.web.servicio;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioCosuConsuscrip;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.ICosuConsuscrip;
import com.bioagricola.apirest.modelo.dtos.CosuConsuscripDTO;
import com.bioagricola.apirest.modelo.dtos.RequestCosuConsuscripDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Recalmo
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/cosuconsuscrip")
public class ServicioCosuConsuscrip implements ICosuConsuscrip {

	@Autowired
	private NegocioCosuConsuscrip negocioCosuConsuscrip;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioCosuConsuscrip.class.getName());

	/**
	 * Método de servicio encargado de realizar la marcación por deshabitado a futuro, que consta
	 * de instertar datos en la tabla de Cosu_Consuscrip
	 */
	@PostMapping(path="/marcacionTarifa", consumes = "application/json", produces = "application/json")
	public List<CosuConsuscripDTO> marcacionTarifa(@RequestBody RequestCosuConsuscripDTO cosuConsuscripDTO)
			throws InvalidParameterException {

		return negocioCosuConsuscrip.marcacionTarifa(cosuConsuscripDTO);
	}

}
