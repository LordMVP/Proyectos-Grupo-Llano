package com.bioagricola.apirest.aprovechamiento.exception;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionControl {
	private static final String MSG_NO_CONSULTA = "No se puede efectuar la consulta";
	private static final String MSG = "mensaje";
	private static final String ERROR = "error";

    private static final Logger logger = LogManager.getLogger(GlobalExceptionControl.class);
    private final Map<String, Object> mensajes = new HashMap<>();

    @ExceptionHandler(value = { ConstraintViolationException.class, NumberFormatException.class })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String,Object>> constraintViolationException(ConstraintViolationException ex) {
        mensajes.put(MSG, MSG_NO_CONSULTA);
        mensajes.put(ERROR, ex.getMessage().concat(" : ").concat(ex.getLocalizedMessage()));
        logger.error(ex.getMessage());
        return new ResponseEntity<>(mensajes, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = { AccessDeniedException.class })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String,Object>> handleAccessDeniedException(AccessDeniedException ex) {
        mensajes.put(MSG, MSG_NO_CONSULTA);
        mensajes.put(ERROR, ex.getMessage().concat(" : ").concat(ex.getLocalizedMessage()));
        logger.error(ex.getMessage());
        return new ResponseEntity<>(mensajes, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(value = {DataAccessException.class })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String,Object>> handleDataAccessException(DataAccessException ex) {
        mensajes.put(MSG, MSG_NO_CONSULTA);
        mensajes.put(ERROR, Objects.requireNonNull(ex.getMessage()).concat(" : ").concat(ex.getMostSpecificCause().getMessage()));
        logger.error(ex.getMessage());
        return new ResponseEntity<>(mensajes, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = { NoHandlerFoundException.class, NullPointerException.class,
            ArrayIndexOutOfBoundsException.class, IOException.class })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Map<String,Object>> handleExceptionArray(Exception ex) {
        mensajes.put(MSG, MSG_NO_CONSULTA);
        mensajes.put(ERROR, ex.getMessage().concat(" : ").concat(ex.getLocalizedMessage()));
        return new ResponseEntity<>(mensajes, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = { Exception.class })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String,Object>> unknownException(Exception ex) {
        mensajes.put(MSG, MSG_NO_CONSULTA);
        mensajes.put(ERROR, ex.getMessage().concat(" : ").concat(ex.getLocalizedMessage()));
        logger.error(ex.getMessage());
        return new ResponseEntity<>(mensajes, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
