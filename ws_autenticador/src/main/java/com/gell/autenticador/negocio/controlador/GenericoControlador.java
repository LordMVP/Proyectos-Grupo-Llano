
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.controlador;

import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.autenticador.negocio.constante.EMensajeNegocio;
import com.gell.autenticador.negocio.excepcion.NegocioExcepcion;
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
    AplicacionExcepcion.class,
    PersistenciaExcepcion.class,
    NegocioExcepcion.class
  })
  @ResponseStatus(HttpStatus.OK)
  public RespuestaDTO controlarError(AplicacionExcepcion e)
  {
    return new RespuestaDTO(e.getCodigo(), e.getMensaje())
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
    return new RespuestaDTO(EMensajeNegocio.ERROR).setMensaje(mensajes.toString());
  }

}
