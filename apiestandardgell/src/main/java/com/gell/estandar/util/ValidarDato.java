/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.gell.estandar.excepcion.AplicacionExcepcion;

/**
 *
 * @author god
 */
public class ValidarDato
{

  private static final ValidarDato INSTANCIA = new ValidarDato();

  private ValidarDato()
  {
  }

  /**
   * Agrega un valor para que se pueda validarConvertir la información
   *
   * @param dato Tipo de dato que se quiere validarConvertir
   * @param validaciones Las condiciones que debe de aplicar el dato
   * @param mensaje Mensaje que se mostrará si hay algún error
   * @return
   * @throws AplicacionExcepcion
   */
  public ValidarDato agregar(Object dato, String validaciones, String mensaje)
          throws AplicacionExcepcion
  {
    new DatoUtil(dato, validaciones, mensaje).validar(null);
    return this;
  }

  /**
   * Crea una INSTANCIA de validarConvertir dato
   *
   * @return Instancia de la clase
   */
  public static ValidarDato construir()
  {
    return INSTANCIA;
  }

  /**
   * Si se está validando más de un dato el método valida todos los campos pero
   * al final devuelve un null
   *
   * Ya no es necesario invocar el método de validar
   *
   * @throws AplicacionExcepcion
   */
  @Deprecated
  public void validar()
          throws AplicacionExcepcion
  {
    /*if (listaDatos.isEmpty()) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_REGLA_NO_EXISTE);
    }
    for (DatoUtil dato : listaDatos) {
      dato.validar(null);
    }*/

  }

  public static ValidarDato validar(Object dato, String validaciones, String mensaje)
          throws AplicacionExcepcion
  {
    INSTANCIA.agregar(dato, validaciones, mensaje);
    return INSTANCIA;
  }

}
