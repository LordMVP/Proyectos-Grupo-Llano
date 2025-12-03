package com.gell.gestioncartera.excepciones;

/**
 * 
 * @author TSI
 * Clase tipo excepcion para el manejo de los registros cuando no existan en las tablas
 */
public class NoDataFoundException extends RuntimeException {
	public NoDataFoundException() {

        super("No existen registros disponibles");
    }
}
