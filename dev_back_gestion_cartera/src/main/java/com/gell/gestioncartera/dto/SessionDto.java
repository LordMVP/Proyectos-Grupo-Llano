package com.gell.gestioncartera.dto;

import java.io.Serializable;

import lombok.Data;

/**
 * 
 * @author TSI
 * Clase DTO para enviar usuario y empresa a los controladores
 */
@Data
public class SessionDto implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6167311278431572707L;
	private String newToken;
	private String idUsuario;
	private String idEmpresa;
}
