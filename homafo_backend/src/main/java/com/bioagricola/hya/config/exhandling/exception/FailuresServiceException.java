package com.bioagricola.hya.config.exhandling.exception;

/**
 * Clase de Excepción para responder en los controladores
 *
 * @author dsolano
 */
public class FailuresServiceException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    /**
     * Constructor de la clase {@link FailuresServiceException}
     * @param msg mensaje de error
     */
    public FailuresServiceException(String msg) {
        super(msg);
    }

    /**
     * Constructor de la clase {@link FailuresServiceException}
     * @param msg mensaje de error
     * @param cause Throwable
     */
    public FailuresServiceException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
