/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dao;

import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.persistencia.exception.PersistenciaExcepcion;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/**
 *
 * @author lrey
 */
public class ParametroDAO extends GenericoDAO
{

  public ParametroDAO(Connection cnn)
  {
    super(cnn);
  }

  public Properties consultar(int idEmpresa)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    PreparedStatement ps = null;
    ResultSet rs = null;
    try {
      ps = cnn.prepareStatement("SELECT par.par_parametro->>'PSE_PARAMETROS' FROM par_parametro par WHERE par.emp_ideregistro = ?");
      ps.setInt(1, idEmpresa);
      rs = ps.executeQuery();
      if (rs.next()) {
        String json = rs.getString(1);
        Properties parametros = new Gson().fromJson(json, Properties.class);
        return parametros;
      }
      throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONSULTAR_PARAMETROS);
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
    } finally {
      cerrar(ps, rs);
    }
  }

  public long controlProceso(String host)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    PreparedStatement ps = null;
    ResultSet rs = null;
    try {
      long cantidad = 1;
      long idProceso = 0;
      this.bloqueoTablaControlProceso();
      ps = cnn.prepareStatement("SELECT count(*) cantidad  FROM wrctr_wreccontrol WHERE wrctr_estado='A' ");
      rs = ps.executeQuery();
      while (rs.next()) {
        cantidad = rs.getLong("cantidad");
        if (cantidad == 0) {
          idProceso = InsertarControlProceso("A", host);
        } else {
          LogUtil.info(" Ya hay un hilo en Ejecución no se puede iniciar el proceso " + idProceso);
        }
      }

      return idProceso;
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
    } finally {
      cerrar(ps, rs);
    }
  }

  public long InsertarControlProceso(String Estado, String host)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    PreparedStatement ps = null;
    ResultSet rs = null;
    try {
      long cantidad = 1;
      long idControl = 0;
      ps = cnn.prepareStatement(" INSERT INTO  wrctr_wreccontrol VALUES(nextval('sq_wrctr_ideregistro'), ? ,now(),null, ? )"
              + "   RETURNING wrctr_ideregistro", Statement.RETURN_GENERATED_KEYS);
      ps.setString(1, Estado);
      ps.setString(2, host);
      ps.executeUpdate();
      rs = ps.getGeneratedKeys();
      if (rs.next()) {
        idControl = rs.getLong(1);
        LogUtil.info("Consecutivo de control Insertado: " + idControl);
      }
      cnn.commit();
      return idControl;
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
    } finally {

      cerrar(ps, rs);
    }

  }

  public boolean ActualizarControlProceso(String Estado, long idControl)
          throws PersistenciaExcepcion, NegocioExcepcion
  {
    PreparedStatement ps = null;
    ResultSet rs = null;
    try {
      long cantidad = 1;
      ps = cnn.prepareStatement("UPDATE wrctr_wreccontrol set wrctr_estado =? ,wrctr_fechafin= now() where  wrctr_ideregistro =? and wrctr_estado='A'");
      ps.setString(1, Estado);
      ps.setLong(2, idControl);
      long resultado;
      resultado = ps.executeUpdate();
      LogUtil.info(" Inactivando Registro de Control idHilo:" + idControl + " Estado:" + Estado + " Resultado :" + resultado);
      cnn.commit();
      return true;
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
    } finally {
      cerrar(ps, rs);
    }

  }

  public void bloqueoTablaControlProceso()
          throws PersistenciaExcepcion
  {
    PreparedStatement ps = null;
    try {
      long resultado = 0;
      ps = cnn.prepareStatement(" LOCK TABLE wrctr_wreccontrol in  ACCESS EXCLUSIVE MODE ");
      resultado = ps.executeUpdate();
      LogUtil.info(" Bloqueo Exclusivo Activado .... Resultado " + resultado);
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajes.ERROR_PERSISTENCIA_CONSULTAR);
    } finally {
      cerrar(ps);
    }
  }

}
