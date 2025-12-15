package com.bioagricola.apirest.modelo.excepciones;

/**
 * Excepcion lanzada cuando alguna regla de negocio se incumple
 *
 * @author GeneradorCRUD
 */
public class NegocioException extends Exception {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public NegocioException(String message) {
        super(message);
    }

    public NegocioException(Throwable cause) {
        super(cause);
    }

    public NegocioException(String message, Throwable cause) {
        super(message, cause);
    }

    public NegocioException(String message, int i) {
        super(message);
    }
}
