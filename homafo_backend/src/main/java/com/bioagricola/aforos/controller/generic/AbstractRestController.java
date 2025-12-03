package com.bioagricola.aforos.controller.generic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.entity.dto.ResponseDTO;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public abstract class AbstractRestController {

	private static final Logger LOGGER = LoggerFactory.getLogger(AbstractRestController.class);
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.OK)
	public ResponseDTO<Void> tratarErrores(final Exception e) {
		LOGGER.error(String.format("Error en servicio Rest %s", e.toString()));
		final ResponseDTO<Void> response = new ResponseDTO<>();
							 response.setMessage("No se ha podido realizar la operacion. Contacte con el Administrador");
							 response.setSuccess(Boolean.FALSE);
		e.printStackTrace();
		return response;
	}
}
