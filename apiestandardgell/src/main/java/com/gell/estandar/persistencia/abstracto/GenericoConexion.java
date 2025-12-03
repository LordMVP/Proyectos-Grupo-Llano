/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.persistencia.abstracto;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.util.LogUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;

/**
 *
 * @author lrey
 */
public abstract class GenericoConexion
{

  public static void desconectar(Connection cnn)
  {
    desconectar(cnn, null, null);
  }

  public static void desconectar(PreparedStatement ps)
  {
    desconectar(null, ps, null);

  }

  public static void desconectar(PreparedStatement ps, ResultSet rs)
  {
    desconectar(null, ps, rs);

  }

  public static void desconectar(Connection cnn, PreparedStatement ps, ResultSet rs)
  {
    try {
      if (rs != null) {
        rs.close();
      }
      if (ps != null) {
        ps.close();
      }
      if (cnn == null) {
        return;
      }
      if (cnn.isClosed()) {
        return;
      }
      rollback(cnn);
      cnn.setAutoCommit(true);
      cnn.close();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }

  public static void rollback(Connection cnn)
  {
    try {
      if (cnn == null) {
        return;
      }
      if (cnn.isClosed()) {
        return;
      }
      cnn.rollback();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }
  
  public static Connection getConexionNativo(DataSource datasource)
          throws PersistenciaExcepcion
  {
    try {
      return datasource.getConnection();
    } catch (SQLException ex) {
      com.gell.estandar.util.LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONECTAR);
    }
  }

}
