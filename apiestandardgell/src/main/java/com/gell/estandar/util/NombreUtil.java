/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import java.util.regex.Pattern;

/**
 *
 * @author God
 */
public class NombreUtil {

  /**
   * Obtiene la extensión de un archivo
   *
   * @param nombre nombre del archivo
   * @return extensión
   */
  public final static String getExtension(String nombre)
  {
    if (nombre == null) {
      return "";
    }
    String[] info = nombre.split(Pattern.quote("."));
    if (info.length <= 1) {
      return "";
    }
    return info[info.length - 1];
  }
}
