package com.gell.gestioncartera.configuracion.seguridad;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.ServletException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.gell.gestioncartera.dto.ResponseDto;
import com.gell.gestioncartera.excepciones.NoDataFoundException;
import com.gell.gestioncartera.excepciones.SeguridadException;
/**
 * 
 * @author TSI
 * Advisor captura de las excepciones de la aplicación
 */
@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {
	private ResponseDto _dto;
	public ControllerAdvisor() {
		_dto = new ResponseDto();
	}
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
			HttpHeaders headers, HttpStatus status, WebRequest request) {
		
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(x -> x.getDefaultMessage())
                .collect(Collectors.toList());
        
        _dto.setCodigoRespuesta(HttpStatus.BAD_REQUEST.value());
        _dto.setMensaje("No hay registro");
        _dto.setData(errors);

        return new ResponseEntity<>(_dto, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(value = { IOException.class, ServletException.class, JsonMappingException.class, JsonProcessingException.class, NumberFormatException.class })
    public ResponseEntity<ResponseDto> handleIOException(
    		IOException ex, WebRequest request) {

        _dto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
        _dto.setMensaje(ex.getMessage());
        _dto.setData(LocalDateTime.now());
        return new ResponseEntity<ResponseDto>(_dto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

	@ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseDto> globalExceptionHandler(
    		Exception ex, WebRequest request) {

        _dto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
        _dto.setMensaje(ex.getMessage());
        _dto.setData(LocalDateTime.now());
        return new ResponseEntity<ResponseDto>(_dto, HttpStatus.INTERNAL_SERVER_ERROR);
    }
	
	@ExceptionHandler(SeguridadException.class)
    public ResponseEntity<ResponseDto> handleSecurityException(
    		SeguridadException ex, WebRequest request) {

        _dto.setCodigoRespuesta(HttpStatus.INTERNAL_SERVER_ERROR.value());
        _dto.setMensaje(ex.getMessage());
        _dto.setData(LocalDateTime.now());
        return new ResponseEntity<ResponseDto>(_dto, HttpStatus.INTERNAL_SERVER_ERROR);
    }

	@ExceptionHandler(NoDataFoundException.class)
    public ResponseEntity<ResponseDto> handleNodataFoundException(
        NoDataFoundException ex, WebRequest request) {

        _dto.setCodigoRespuesta(HttpStatus.NOT_FOUND.value());
        _dto.setMensaje("No hay registro");
        _dto.setData(LocalDateTime.now());
        return new ResponseEntity<ResponseDto>(_dto, HttpStatus.OK);
    }
}
