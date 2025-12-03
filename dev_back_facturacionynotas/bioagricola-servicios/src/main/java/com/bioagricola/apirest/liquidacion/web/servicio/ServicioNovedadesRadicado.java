package com.bioagricola.apirest.liquidacion.web.servicio;

import java.io.IOException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.liquidacion.negocio.NegocioNovedadesRadicado;
import com.bioagricola.apirest.modelo.dtos.NovedadesRadicadoDTO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

@RestController
@RequestMapping("/webresources/servicios/novedadesradicado")
public class ServicioNovedadesRadicado {
	
	@Autowired
	private NegocioNovedadesRadicado negocioNovedadesRadicado;
	
	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioParParametro.class.getName());

	/**
	 * Método de servicio encargado de consultar los parámetros del codigo de novedad
	 */
	@GetMapping("/codigoNovedad")
	public List<NovedadesRadicadoDTO> consultaCodigoNovedad() throws JsonParseException, JsonMappingException, IOException {

		return negocioNovedadesRadicado.consultaCodigoNovedad();
	}
}
