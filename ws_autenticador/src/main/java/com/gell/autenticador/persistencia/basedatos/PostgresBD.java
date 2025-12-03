/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.persistencia.basedatos;

import com.gell.estandar.persistencia.abstracto.GenericoConexion;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.LogUtil;
import com.gell.autenticador.persistencia.constante.EMensajePersistencia;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.springframework.jdbc.datasource.DataSourceUtils;

/**
 *
 * @author hrey
 */
public class PostgresBD extends GenericoConexion {

  public static Connection conectar()
          throws AplicacionExcepcion
  {
    try {

      ////ESTO ES PARA EL POOL DE CONEXIONES
//            Context context = new InitialContext();
//            DataSource ds = (DataSource) context.lookup("jdbc/PorroRiofrio");
//            Connection cnn = ds.getConnection();
      // Conexión a la base de datos para el desarrollo
      Class.forName("org.postgresql.Driver");
      Connection cnn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/grupollano", "postgres", "1234");
      cnn.setAutoCommit(false);
      return cnn;
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajePersistencia.ERROR_CONEXION_BD);
    }
  }

  public static Connection getConexion(DataSource datasource)
          throws PersistenciaExcepcion
  {
    try {
      return DataSourceUtils.doGetConnection(datasource);
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_CONEXION_BD);
    }
  }

  public static void commit(DataSource datasource)
          throws PersistenciaExcepcion
  {
    try {
      getConexion(datasource).commit();
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_CONFIRMAR);
    }
  }

  public static void rollback(DataSource datasource)
          throws PersistenciaExcepcion
  {
    try {
      getConexion(datasource).rollback();
    } catch (SQLException ex) {
      LogUtil.error(ex);
    }
  }

}
