/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.excepcion.AplicacionExcepcion;

import java.util.regex.Pattern;

/**
 * @author god
 */
class DatoUtil extends FuncionesDatoUtil
{

  private final Object dato;
  private final String validaciones;
  private final String mensaje;

  public DatoUtil(Object valor, String validaciones, String mensaje)
  {
    this.dato = valor;
    this.validaciones = validaciones;
    this.mensaje = mensaje;
  }

  /**
   * Método encargado de validar que el dato cumpla con la validaciones
   * correspondientes
   *
   * @param <T>
   * @return
   * @throws NegocioExcepcion
   */
  public <T extends Object> T validar(Class clase)
          throws AplicacionExcepcion
  {

    String[] reglas = validaciones.split(Pattern.quote("|"));
    for (String nombreRegla : reglas) {
      switch (nombreRegla.toLowerCase()) {
        case "numero":
          Number numero = validarNumero(dato, mensaje);
          return (T) convertirNumero(numero, clase);
        case "requerido":
          validarRequerido(dato, mensaje);
          break;
        case "correo":
          return (T) validarCorreo(dato, mensaje);
        case "fecha":
          return (T) validarFecha(dato, mensaje);
        default:
          throw new AplicacionExcepcion(EMensajeEstandar.ERROR_REGLA_NO_EXISTE);
      }
    }
    return (T) dato;
  }

  private Object convertirNumero(Number numero, Class clase)
  {
    if (clase == null) {
      return null;
    }
    if (numero == null) {
      return null;
    }
    if (Integer.class == clase) {
      return numero.intValue();
    }
    if (Long.class == clase) {
      return numero.longValue();
    }
    if (Float.class == clase) {
      return numero.floatValue();
    }
    return numero.doubleValue();
  }

}
