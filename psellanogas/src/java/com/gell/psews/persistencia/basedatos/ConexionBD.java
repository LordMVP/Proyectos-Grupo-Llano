/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.basedatos;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.naming.InitialContext;
import javax.sql.DataSource;

/**
 * Clase encargada de gestionar las conexiones con el motor de base de datos
 *
 * @author lrey
 */
public class ConexionBD
{

  /**
   * Realiza la conexión a la base de datos
   *
   * @return Conexión a la base de datos
   * @throws PersistenciaExcepcion Devuelve un error si no se puede establecer
   * la conexion y se personaliza la excepción
   */
  public static Connection conectar()
          throws PersistenciaExcepcion
  {
    try {

      InitialContext contexto = new InitialContext();   
        DataSource ds = (DataSource) contexto.lookup("java:/Poolllanogas169");
      Connection cnn = ds.getConnection();
      cnn.setAutoCommit(false);
      return cnn;
    } catch (Throwable ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONEXION);
    }
  }

  /**
   * Cierra los recursos de una conexión
   *
   * @param rs Libera los recursos de una consulta
   * @param ps Libera la sentencia que se ejecutó
   * @param cnn Libera la conexión a la base de datos para que quede disponible
   * para otra petición
   */
  public static void cerrar(ResultSet rs, PreparedStatement ps, Connection cnn)
  {
    cerrarResultado(rs);
    cerrarSentencia(ps);
    rollbackSinError(cnn);
    cerrarConexion(cnn);
  }

  private static void cerrarResultado(ResultSet rs)
  {
    if (rs == null) {
      return;
    }
    try {
      rs.close();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }

  private static void cerrarSentencia(PreparedStatement ps)
  {
    if (ps == null) {
      return;
    }
    try {
      ps.close();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }

  private static void cerrarConexion(Connection cnn)
  {
    if (cnn == null) {
      return;
    }
    try {
      cnn.close();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }

  /**
   * Cierrar una sentencia y el resultado
   *
   * @param rs
   * @param ps
   */
  public static void cerrar(ResultSet rs, PreparedStatement ps)
  {
    cerrar(rs, ps, null);
  }

  /**
   * Cierra una sentencia
   *
   * @param ps
   */
  public static void cerrar(PreparedStatement ps)
  {
    cerrar(null, ps, null);
  }

  /**
   * Libera los recursos de la conexión
   *
   * @param cnn
   */
  public static void cerrar(Connection cnn)
  {
    cerrar(null, null, cnn);
  }

  /**
   * Confirma los cambios realizados en la base de datos
   *
   * @param cnn
   * @throws PersistenciaExcepcion
   */
  public static void commit(Connection cnn)
          throws PersistenciaExcepcion
  {
    try {
      cnn.commit();
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_COMMIT);
    }
  }

  /**
   * Si se genera algún error se devuelven los cambios
   *
   * @param cnn
   * @throws PersistenciaExcepcion
   */
  public static void rollback(Connection cnn)
          throws PersistenciaExcepcion
  {
    try {
      cnn.rollback();
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_ROLLBACK);
    }
  }

  public static void rollbackSinError(Connection cnn)
  {
    if (cnn == null) {
      return;
    }
    try {
      cnn.rollback();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }

}
