package com.bioagricola.apirest.liquidacion.web.servicio;

import java.io.IOException;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioVisitasSol;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.IVisitasSol;
import com.bioagricola.apirest.modelo.dtos.RequestVisitasSolDTO;
import com.bioagricola.apirest.modelo.entidades.VisitasSol;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import javax.persistence.NoResultException;

/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad VisitasSol
 * 
 * @author GeneradorCRUD
 */

@RestController
@RequestMapping("/webresources/servicios/visitasSol")
public class ServicioVisitasSol implements IVisitasSol {

	@Autowired
	private NegocioVisitasSol negocioVisitasSol; 
	
	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioDfacDetfactura.class.getName());

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
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 */
	@PostMapping(path = "/agregar", consumes = "application/json", produces = "application/json")
	public VisitasSol agregarRegistro(@RequestBody RequestVisitasSolDTO agregarSol)
			throws InvalidParameterException, JsonParseException, JsonMappingException, IOException,NoResultException{

		return negocioVisitasSol.agregarRegistro(agregarSol);
	}
}
