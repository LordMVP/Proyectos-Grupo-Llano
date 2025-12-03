package com.bioagricola.apirest.modelo.excepciones;

/**
 * Excepción lanzada cuando alguno de los parámetros enviados en la url no son 
 * válidos.
 * 
 * @author GeneradorCRUD
 */
public class InvalidParameterException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
    
    public InvalidParameterException (String message) {
        super (message);
    }

    public InvalidParameterException (Throwable cause) {
        super (cause);
    }

    public InvalidParameterException (String message, Throwable cause) {
        super (message, cause);
    }
}
