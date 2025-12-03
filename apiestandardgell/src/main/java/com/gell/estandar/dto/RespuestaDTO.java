/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.dto;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.plantilla.IGenericoMensaje;
import java.util.List;

/**
 *
 * @author God
 * @param <T>
 */
public class RespuestaDTO<T> {

  private int codigo;
  private String mensaje;
  private T datos;

  public RespuestaDTO()
  {
    this(EMensajeEstandar.OK);
  }

  public RespuestaDTO(IGenericoMensaje iMensaje)
  {
    setRespuesta(iMensaje);
  }

  private void setRespuesta(IGenericoMensaje iMensaje)
  {
    this.codigo = iMensaje.getCodigo();
    this.mensaje = iMensaje.getMensaje();
  }

  public RespuestaDTO(int codigo, String mensaje)
  {
    this.codigo = codigo;
    this.mensaje = mensaje;
  }

  public int getCodigo()
  {
    return codigo;
  }

  public RespuestaDTO<T> setCodigo(int code)
  {
    this.codigo = code;
    return this;
  }

  public String getMensaje()
  {
    return mensaje;
  }

  public RespuestaDTO<T> setMensaje(String mensaje)
  {
    this.mensaje = mensaje;
    return this;
  }

  public T getDatos()
  {
    return datos;
  }

  public RespuestaDTO<T> setDatos(T datos)
  {
    this.datos = datos;
    if (datos instanceof List) {
      validarLista((List) datos);
    }
    return this;
  }

  private void validarLista(List datos)
  {
    if (datos == null || datos.isEmpty()) {
      setRespuesta(EMensajeEstandar.NO_RESULTADOS);
      this.datos = null;
    }
  }

}
