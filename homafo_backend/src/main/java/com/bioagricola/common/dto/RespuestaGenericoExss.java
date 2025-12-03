package com.bioagricola.common.dto;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
public class RespuestaGenericoExss <T> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -2900344798557298325L;
	
	
	public T objeto;
	public String mensaje;
	public Integer codigo;	
	
	
}
