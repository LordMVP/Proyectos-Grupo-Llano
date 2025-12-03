package com.bioagricola.homologaciones.dto;

import lombok.Data;

@Data
public class RespuestaGenerica <T>{
	
	public T objeto;
	public Integer codigo;
	public String mensaje;

}
