package com.bioagricola.hya.config.exhandling;

import com.bioagricola.hya.config.exhandling.exception.FailuresServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

/**
 * Clase de Controles de Excepciones para responder en los controladores
 *
 * @author dsolano
 */
@RestControllerAdvice
public class ControllerExceptionHandler {
    /**
     * Metodo de excepciones de fallos en los servicios
     *
     * @param ex      excepción capturada
     * @param request solicitud Web
     * @return retorna un {@link ErrorMessageDTO}
     */
    @ExceptionHandler(FailuresServiceException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO failuresServiceException(FailuresServiceException ex, WebRequest request) {
        return new ErrorMessageDTO(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                request.getDescription(false));
    }

    /**
     * Metodo de excepciones de argumentos ilegales
     *
     * @param ex      excepción capturada
     * @param request solicitud Web
     * @return retorna un {@link ErrorMessageDTO}
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public ErrorMessageDTO illegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        return new ErrorMessageDTO(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                request.getDescription(false));
    }

    /**
     * Metodo de excepciones globales
     *
     * @param ex      excepción capturada
     * @param request solicitud Web
     * @return retorna un {@link ErrorMessageDTO}
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessageDTO globalExceptionHandler(Exception ex, WebRequest request) {
        return new ErrorMessageDTO(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage(),
                request.getDescription(false));
    }

}
