package com.bioagricola.apirest.liquidacion.web.servicio;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioDsusDetsuscrip;
import com.bioagricola.apirest.modelo.dtos.ConsultaConceptosDeshabitadoDTO;
import com.bioagricola.apirest.modelo.dtos.ResponseConsulSuscripReliquidadasDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;



/**
 * Servicios REST para operaciones CRUD y de negocio sobre la entidad
 * DsusDetsuscrip
 * 
 * @author GeneradorCRUD
 */
@RestController
@RequestMapping("/webresources/servicios/dsusdeshabitado")
public class ServicioDescDeshabitado {
	
	
	
	@Autowired
	private NegocioDsusDetsuscrip negocioDsusDetsuscrip;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioDsusDetsuscrip.class.getName());

	
	/**
	 * Servicio de consulta de detalle de suscripcion en la opción deshabitado/es según los parámetros
	 * ingresados
	 * 
	 * @param idSuscripcion  valor del id de suscripción a consultar

	 */
	@GetMapping("/consultaDeshabitado")
	public ResponseConsulSuscripReliquidadasDTO consultaDetalle(
			@RequestParam(value = "idSuscripcion") Long idSuscripcion ) throws InvalidParameterException {

		return negocioDsusDetsuscrip.consultaDetalleSusDeshabitado(idSuscripcion);
	}

	
	/**
	 * Servicio de consulta de detalle de suscripcion en la opción deshabitado/es según los parámetros
	 * ingresados
	 * 
	 * @param idSuscripcion  valor del id de suscripción a consultar

	 */
	@GetMapping("/consultaConceptoDeshab")
	public List<ConsultaConceptosDeshabitadoDTO> consultaConceptoDeshabitado(
			@RequestParam(value = "idSuscripcion") Long idSuscripcion ) throws InvalidParameterException {
		return negocioDsusDetsuscrip.consultaConceptosDeshabitado(idSuscripcion);
	}
}
