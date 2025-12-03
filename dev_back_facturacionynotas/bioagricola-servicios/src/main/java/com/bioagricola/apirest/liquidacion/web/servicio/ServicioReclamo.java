package com.bioagricola.apirest.liquidacion.web.servicio;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioReclamo;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IReclamo;
import com.bioagricola.apirest.modelo.dtos.ConsultaPqrDTO;
import com.bioagricola.apirest.modelo.dtos.RequestReclamoDTO;
import com.bioagricola.apirest.modelo.entidades.Reclamos;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad Recalmos
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/reclamos")
public class ServicioReclamo implements IReclamo {

	@Autowired
	private NegocioReclamo negocioReclamo;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioReclamo.class.getName());

	/**
	 * Servicio de consulta de PQR seún los parámetros ingresados
	 * 
	 * @param numeroPqr        valor del reclamo de pqr a consultar
	 * @param idSuscripcion    valor opcional para la consulta de un número de PQR
	 * @param nombreTercero    valor opcional para la consulta de un número de PQR
	 * @param terceroDocumento valor opcional para la consulta de un número de PQR
	 */
	@GetMapping("/consultaPqr")
	public List<ConsultaPqrDTO> consultaPqr(@RequestParam(value = "numeroPqr") String numeroPqr,
			@RequestParam(value = "idSuscripcion") Long idSuscripcion,
			@RequestParam(value = "nombreTercero") String nombreTercero,
			@RequestParam(value = "terceroDocumento") String terceroDocumento) throws InvalidParameterException {

		return negocioReclamo.consultaPqr(numeroPqr, idSuscripcion, nombreTercero, terceroDocumento);
	}

	/**
	 * Servicio de modificación de PQR seún los parámetros ingresados y validacion
	 * de los mismos
	 * 
	 * @param numeroPqr        valor del reclamo de pqr a consultar
	 * @param idSuscripcion    valor opcional para la consulta de un número de PQR
	 * @param nombreTercero    valor opcional para la consulta de un número de PQR
	 * @param terceroDocumento valor opcional para la consulta de un número de PQR
	 * @param observacion      valor opcional de las nuevas observaciones para la
	 *                         PQR
	 */
	@PutMapping(path = "/modificarPqr", consumes = "application/json", produces = "application/json")
	public Reclamos modificarPqr(@RequestBody RequestReclamoDTO modificaPQR) throws InvalidParameterException {

		return negocioReclamo.modificarPqr(modificaPQR);
	}

}
