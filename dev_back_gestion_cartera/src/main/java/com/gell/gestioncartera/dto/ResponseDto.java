package com.gell.gestioncartera.dto;

import java.io.Serializable;
import java.util.Map;

import lombok.Data;
/**
 * 
 * @author TSI
 * Clase DTO para enviar respuesta con los datos de los microservicios
 */
@Data
public class ResponseDto implements Serializable {
	private static final long serialVersionUID = 1L;
	private int codigoRespuesta;
	private Object data;
	private String mensaje;
}
