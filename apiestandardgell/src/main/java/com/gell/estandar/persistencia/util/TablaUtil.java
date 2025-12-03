/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.persistencia.util;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author hrey
 */
public class TablaUtil {

  public static Map<String, Integer> getColumnas(ResultSet rs)
          throws SQLException
  {
    Map<String, Integer> columnas = new HashMap<>();
    ResultSetMetaData rsData = rs.getMetaData();
    int numeroColumnas = rsData.getColumnCount();
    for (int i = 1; i <= numeroColumnas; i++) {
      columnas.put(rsData.getTableName(i) + "_" + rsData.getColumnName(i), i);
    }
    return columnas;
  }

  public static Map<String, Integer> getColumnasAlias(ResultSet rs)
          throws SQLException
  {
    Map<String, Integer> columnas = new HashMap<>();
    ResultSetMetaData rsData = rs.getMetaData();
    int numeroColumnas = rsData.getColumnCount();
    for (int i = 1; i <= numeroColumnas; i++) {
      validarExisteAlias(columnas, rsData, i, 1);
    }
    return columnas;
  }

  private static void validarExisteAlias(Map<String, Integer> columnas, ResultSetMetaData rsData, int pos, Integer contador)
          throws SQLException
  {
    String nombreCampo = rsData.getTableName(pos) + contador + "_" + rsData.getColumnName(pos);
    if (!columnas.containsKey(nombreCampo)) {
      columnas.put(nombreCampo, pos);
      return;
    }
    validarExisteAlias(columnas, rsData, pos, ++contador);
  }

}
