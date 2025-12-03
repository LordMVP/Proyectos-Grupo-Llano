/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.excepcion.AplicacionExcepcion;

/**
 *
 * @author spiwer.com - Herman Leonardo Rey Baquero - leoreyb@gmail.com
 */
public class EntidadUtil
{

  public static <T> T init(T entidad, String mensaje)
          throws AplicacionExcepcion
  {
    if (entidad == null) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ENTIDAD);
    }
    return entidad;
  }

}
