/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.persistencia.abstracto;

import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.plantilla.IGenericoMensaje;
import com.gell.estandar.util.FuncionesDatoUtil;
import com.gell.estandar.util.LogUtil;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

/**
 *
 * @author lrey
 * @param <T> Entidad que se quiere manipular
 */
@FunctionalInterface
public interface ConsultaAdaptador<T>
{

  public abstract T siguiente(ResultSet rs, Map<String, Integer> columns)
          throws PersistenciaExcepcion;

  public default void sinResultados()
          throws PersistenciaExcepcion
  {
    //throw new PersistenciaExcepcion(EMensajePersistencia.NO_RESULTADOS);
  }

  public default void sinResultados(IGenericoMensaje mensaje)
          throws PersistenciaExcepcion
  {
    if (mensaje == null) {
      sinResultados();
      return;
    }
    throw new PersistenciaExcepcion(mensaje);

  }

  public default void error(Exception ex)
          throws PersistenciaExcepcion
  {
    LogUtil.error(ex);
    throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
  }

  public default void error(SQLException ex)
          throws PersistenciaExcepcion
  {
    LogUtil.error(ex);
    String mensaje = FuncionesDatoUtil.mensaje(ex);
    throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR_PERSONALIZADO, mensaje);
  }

}
