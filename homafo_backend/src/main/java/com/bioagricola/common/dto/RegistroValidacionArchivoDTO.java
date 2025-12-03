package com.bioagricola.common.dto;

import com.bioagricola.common.util.ENUM_TIPO_VALIDACION;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegistroValidacionArchivoDTO {

	private ENUM_TIPO_VALIDACION validacion;
	private Integer fila;
	private Integer columnaIndex;
	private String columnaNombre;
	private String mensaje;
	private Object valor;
	
	public static RegistroValidacionArchivoDTO buildFormatDataMessage(Integer fila,Integer columnaIndex,String columnaNombre,String valor) {
		return new RegistroValidacionArchivoDTO(ENUM_TIPO_VALIDACION.FORMAT_DATA,fila,columnaIndex,columnaNombre,"Columna ["+columnaNombre+"] no cumple con el tipo de dato, valor encontrado ["+valor+"]",valor);		
	}
	
	public static RegistroValidacionArchivoDTO buildValidadorMessage(Integer fila,Integer columnaIndex,String columnaNombre,String valor) {
		return new RegistroValidacionArchivoDTO(ENUM_TIPO_VALIDACION.FORMAT_DATA,fila,columnaIndex,columnaNombre,"Columna ["+columnaNombre+"] no cumple con la validacion del dato ["+valor+"]",valor);		
	}
	
	public static RegistroValidacionArchivoDTO buildNumColumnsMessage(Integer fila,Integer columnaIndex,String columnaNombre,String valor) {
		return new RegistroValidacionArchivoDTO(ENUM_TIPO_VALIDACION.NUM_COLUMNS,fila,columnaIndex,columnaNombre,"Columna ["+columnaNombre+"] no cumple con el tipo de dato ["+valor+"]",valor);		
	}
	
	public static RegistroValidacionArchivoDTO buildNumColumnsValorMessage(Integer fila,Integer columnaIndex,String columnaNombre,String valor) {
		return new RegistroValidacionArchivoDTO(ENUM_TIPO_VALIDACION.NUM_COLUMNS,fila,columnaIndex,columnaNombre,"Fila : "+ fila +" Columna ["+columnaNombre+"] no cumple con el tipo de dato ["+valor+"]",valor);		
	}
}
