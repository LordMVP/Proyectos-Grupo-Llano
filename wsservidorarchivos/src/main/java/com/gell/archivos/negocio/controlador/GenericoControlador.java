
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.negocio.controlador;

import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.RespuestaDTO;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author god
 */
public class GenericoControlador {

  @ExceptionHandler({
    AplicacionExcepcion.class,})
  @ResponseStatus(HttpStatus.OK)
  public RespuestaDTO controlarError(AplicacionExcepcion e)
  {
    return new RespuestaDTO()
            .setCodigo(e.getCodigo())
            .setMensaje(e.getMensaje())
            .setDatos(e.getDatos());
  }

  @ResponseStatus(HttpStatus.OK)
  public RespuestaDTO controlarError(NumberFormatException e)
  {
    return new RespuestaDTO(-1, "Error al convertir");
  }

  @ExceptionHandler({MethodArgumentNotValidException.class})
  @ResponseStatus(value = HttpStatus.OK)
  public RespuestaDTO handleException(MethodArgumentNotValidException ex)
  {
    List<ObjectError> listaErrores = ex.getBindingResult().getAllErrors();
    StringBuilder mensajes = new StringBuilder();

    for (ObjectError error : listaErrores) {
      mensajes.append(error.getDefaultMessage())
              .append(" ");
    }
    return new RespuestaDTO(EMensajeEstandar.ERROR).setMensaje(mensajes.toString());
  }

}
