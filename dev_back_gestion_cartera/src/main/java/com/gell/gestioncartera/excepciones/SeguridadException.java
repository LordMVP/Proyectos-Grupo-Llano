package com.gell.gestioncartera.excepciones;

/**
 * 
 * @author TSI
 * Clase tipo excepcion para el manejo de los errores al autenticar
 */
public class SeguridadException extends RuntimeException {
	public SeguridadException() {

        super("Error al autenticar");
    }
}
