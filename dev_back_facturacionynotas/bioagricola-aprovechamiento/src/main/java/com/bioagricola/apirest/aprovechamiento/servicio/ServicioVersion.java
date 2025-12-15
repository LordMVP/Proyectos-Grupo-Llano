package com.bioagricola.apirest.aprovechamiento.servicio;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.apirest.aprovechamiento.negocio.NegocioVersion;
import com.bioagricola.apirest.aprovechamiento.negocio.interfaces.IVersion;

@RestController
@RequestMapping("/version")
public class ServicioVersion implements IVersion {

	@Autowired
	private NegocioVersion negocioVersion;

	/**
	 * Variable estatica para imprimir logs...
	 */
	private static final Logger logger = Logger.getLogger(ServicioVersion.class.getName());

	@GetMapping
	public String version() {
		return negocioVersion.version();
	}
}
