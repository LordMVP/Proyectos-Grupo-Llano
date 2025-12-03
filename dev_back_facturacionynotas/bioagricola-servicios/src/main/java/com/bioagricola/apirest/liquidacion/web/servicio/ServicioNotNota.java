package com.bioagricola.apirest.liquidacion.web.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioNotNota;
import com.bioagricola.apirest.liquidacion.negocio.interfaces.INotNota;
import com.bioagricola.apirest.modelo.dtos.NotNotaDTO;
import com.bioagricola.apirest.modelo.dtos.RequestNotNotaDTO;
import com.bioagricola.apirest.modelo.excepciones.InvalidParameterException;

@RestController
@RequestMapping("/webresources/servicios/notNota")
public class ServicioNotNota implements INotNota {

	@Autowired
	private NegocioNotNota negocioNotNota;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioDfacDetfactura.class.getName());

	/**
	 * Servicio para agregar una nota a la tabla not_nota
	 * 
	 * @param nuevaNota Json con tosos los parametros necesarios para el nuevo
	 *                  registro
	 */
	@PostMapping (path = "/agregarNota", consumes = "application/json", produces = "application/json")
	public NotNotaDTO agregarNota(@RequestBody RequestNotNotaDTO nuevaNota) throws InvalidParameterException {

		return negocioNotNota.agregarNota(nuevaNota);
	}

}
