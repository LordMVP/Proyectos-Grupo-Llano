package com.gell.estandar.persistencia.abstracto;

import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.persistencia.util.PreparedStatementNamed;
import com.gell.estandar.persistencia.util.TablaUtil;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.util.LogUtil;
import com.gell.estandar.util.FuncionesDatoUtil;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.plantilla.IGenericoMensaje;
import com.gell.estandar.util.Param;
import java.sql.Array;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 *
 * @author hrey
 */
@SuppressWarnings("UseSpecificCatch")
public abstract class GenericoCRUD extends FuncionesDatoUtil
{

  protected Connection cnn;
  /**
   * Se recomienda utilizar el método params()
   *
   */
  protected Map<String, Object> parametros = new HashMap<>();

  protected AuditoriaDTO auditoria;
  private static final int NO_REGISTROS = 0;

  public GenericoCRUD(Connection cnn, AuditoriaDTO auditoria)
  {
    this.cnn = cnn;
    this.auditoria = auditoria;

  }

  public static Param<String, Object> params()
  {
    return new Param<>();
  }

  /**
   * Devulve el valor de una columna
   *
   * @param <T> Tipo de dato de la columna
   * @param pos Posición de la columna que se quiere consultar
   * @param tipo Tipo de dato de la columna
   * @param rs Resultset de la base de datos
   * @return Valor
   * @throws PersistenciaExcepcion Si la columna no existe se lanza un error
   */
  protected static <T> T getObject(Integer pos, Class<T> tipo, ResultSet rs)
          throws PersistenciaExcepcion
  {
    try {
      String objDato = rs.getString(pos);
      if (objDato == null) {
        return null;
      }
      if (tipo == String.class) {
        return tipo.cast(objDato);
      }
      if (tipo == Boolean.class) {
        return tipo.cast(rs.getBoolean(pos));
      }
      if (tipo == Long.class) {
        return tipo.cast(rs.getLong(pos));
      }
      if (tipo == Integer.class) {
        return tipo.cast(rs.getInt(pos));
      }
      if (tipo == LocalDateTime.class) {
        LocalDateTime localDateTime = rs.getTimestamp(pos).toLocalDateTime();
        return tipo.cast(localDateTime);
      }
      if (tipo == LocalDate.class) {
        LocalDate localDate = rs.getDate(pos).toLocalDate();
        return tipo.cast(localDate);
      }
      if (tipo == LocalTime.class) {
        LocalTime localTime = rs.getTime(pos).toLocalTime();
        return tipo.cast(localTime);
      }
      if (tipo == Timestamp.class || tipo == Date.class) {
        return tipo.cast(rs.getTimestamp(pos));
      }
      Object objValor = tipo.getMethod("valueOf", String.class).invoke(null, objDato);
      return tipo.cast(objValor);
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_COLUMNA_NO_ENCONTRADA);
    }
  }

  /**
   * Consultar un string de un resultset
   *
   * @param columna nombre de la columna
   * @param rs Información del resultset
   * @return valor
   * @throws PersistenciaExcepcion Error columna no existe
   */
  protected static String getString(String columna, ResultSet rs)
          throws PersistenciaExcepcion
  {
    return getObject(columna, String.class, rs);
  }

  /**
   * Consultar un double de un resultset
   *
   * @param columna nombre de la columna
   * @param rs Información del resultset
   * @return valor
   * @throws PersistenciaExcepcion Error columna no existe
   */
  protected static Double getDouble(String columna, ResultSet rs)
          throws PersistenciaExcepcion
  {
    return getObject(columna, Double.class, rs);
  }

  /**
   * Consultar un int de un resultset
   *
   * @param columna nombre de la columna
   * @param rs Información del resultset
   * @return valor
   * @throws PersistenciaExcepcion Error columna no existe
   */
  protected static Integer getInteger(String columna, ResultSet rs)
          throws PersistenciaExcepcion
  {
    return getObject(columna, Integer.class, rs);
  }

  /**
   * Devuelve el valor de una columna por el nombre
   *
   * @param <T> Tipo de dato de la columna
   * @param columna Nombre de la columna
   * @param tipo Tipo de dato de la columna
   * @param rs Resultset de la base de datos
   * @return Valor de la columna
   * @throws PersistenciaExcepcion Erro si la columna no existe
   */
  public static <T> T getObject(String columna, Class<T> tipo, ResultSet rs)
          throws PersistenciaExcepcion
  {
    try {
      return getObject(rs.findColumn(columna), tipo, rs);
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_COLUMNA_NO_ENCONTRADA);
    }
  }

  /**
   * Devuelve el valor de una columna y si la columna no existe devuelve null
   *
   * @param <T> Tipo de dato de la columna
   * @param columna Nombre de la columna
   * @param tipo Tipo de dato de la columna
   * @param rs Resultset de la consulta
   * @return Valor de la columna
   */
  public static <T> T getObjectOpcional(String columna, Class<T> tipo, ResultSet rs)
  {
    try {
      return getObject(rs.findColumn(columna), tipo, rs);
    } catch (Exception ex) {
      LogUtil.infoError(ex.getMessage());
      return null;
    }
  }

  /**
   * Método que ejecuta un delete o un update
   *
   * @param sql Sentencia sql
   * @param parametros Parámetros de la consulta
   * @return cantidad de registros afectados
   * @throws PersistenciaExcepcion Error al actualizar los registros en la base
   * de datos
   */
  protected int ejecutarEdicion(StringBuilder sql, Map<String, Object> parametros)
          throws PersistenciaExcepcion
  {
    return ejecutarEdicion(sql, parametros, new ModificarAdaptador()
    {
    });
  }

  protected int ejecutarEdicion(StringBuilder sql, Map<String, Object> parametros, ModificarAdaptador adaptador)
          throws PersistenciaExcepcion
  {
    log(sql, parametros);
    PreparedStatementNamed ps = null;
    try {
      ps = new PreparedStatementNamed(cnn, sql.toString());
      if (parametros != null) {
        Set<String> keys = parametros.keySet();
        for (String key : keys) {
          ps.setObject(key, parametros.get(key));
        }
      }
      int quantity = ps.executeUpdate();
      if (quantity == NO_REGISTROS) {
        adaptador.sinResultados();
      }
      return quantity;
    } catch (SQLException ex) {
      LogUtil.error(ex);
      adaptador.error(ex);
      return NO_REGISTROS;
    } finally {
      desconectar(ps);
      this.parametros = new HashMap<>();
    }
  }

  protected <T> T ejecutarConsultaSimple(StringBuilder sql, Map<String, Object> parameters, ConsultaAdaptador<T> query)
          throws PersistenciaExcepcion
  {
    return ejecutarConsultaSimple(sql, parameters, null, query);
  }

  protected <T> T ejecutarConsultaSimple(StringBuilder sql, Map<String, Object> parameters, IGenericoMensaje mensaje, ConsultaAdaptador<T> query)
          throws PersistenciaExcepcion
  {
    log(sql, parameters);
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    try {
      ps = new PreparedStatementNamed(cnn, sql.toString());
      if (parameters != null) {
        Set<String> keys = parameters.keySet();
        for (String key : keys) {
          ps.setObject(key, parameters.get(key));
        }
      }
      rs = ps.executeQuery();
      Map<String, Integer> columns = TablaUtil.getColumnasAlias(rs);
      if (rs.next()) {
        return query.siguiente(rs, columns);
      }
      query.sinResultados(mensaje);
      return null;
    } catch (SQLException ex) {
      LogUtil.error(ex);
      query.error(ex);
      return null;
    } finally {
      desconectar(ps, rs);
      this.parametros = new HashMap<>();
    }
  }

  protected <T extends Object> List<T> ejecutarConsulta(StringBuilder sql,
          Map<String, Object> parameters,
          IGenericoMensaje sinResultado,
          ConsultaAdaptador<T> adaptador)
          throws PersistenciaExcepcion
  {
    log(sql, parameters);
    PreparedStatementNamed ps = null;
    ResultSet rs = null;
    List<T> list = new ArrayList<>();
    try {
      ps = new PreparedStatementNamed(cnn, sql.toString());
      if (parameters != null) {
        Set<String> keys = parameters.keySet();
        for (String key : keys) {
          ps.setObject(key, parameters.get(key));
        }
      }
      rs = ps.executeQuery();
      Map<String, Integer> columns = TablaUtil.getColumnasAlias(rs);
      while (rs.next()) {
        T register = adaptador.siguiente(rs, columns);
        list.add(register);
      }
      if (list.isEmpty()) {
        adaptador.sinResultados(sinResultado);
      }
      return list;
    } catch (SQLException ex) {
      LogUtil.error(ex);
      adaptador.error(ex);
      return null;
    } finally {
      desconectar(ps, rs);
      this.parametros = new HashMap<>();
    }
  }

  protected <T extends Object> List<T> ejecutarConsulta(StringBuilder sql, Map<String, Object> parameters, ConsultaAdaptador<T> adaptador)
          throws PersistenciaExcepcion
  {
    return ejecutarConsulta(sql, parameters, null, adaptador);
  }

  protected void desconectar(PreparedStatement ps, ResultSet rs)
  {
    GenericoConexion.desconectar(ps, rs);
  }

  protected void desconectar(PreparedStatementNamed ps, ResultSet rs)
  {
    if (ps == null) {
      return;
    }
    GenericoConexion.desconectar(ps.getStatement(), rs);
  }

  protected void desconectar(PreparedStatement ps)
  {
    GenericoConexion.desconectar(ps);
  }

  protected void desconectar(PreparedStatementNamed ps)
  {
    if (ps == null) {
      return;
    }
    GenericoConexion.desconectar(ps.getStatement());
  }

  private void log(StringBuilder sql, Map<String, Object> params)
  {
    LogUtil.info(
            new StringBuilder("SQL: ")
                    .append(sql)
                    .append(" Parámetros: ")
                    .append(params)
                    .toString());

  }

  protected Array crearArregloTexto(Object[] elementos)
          throws PersistenciaExcepcion
  {
    Object[] datos = new Object[elementos.length];
    System.arraycopy(elementos, 0, datos, 0, elementos.length);
    return crearArreglo("TEXT", datos);
  }

  protected Array crearArregloEnteros(Object[] elementos)
          throws PersistenciaExcepcion
  {
    Object[] datos = new Object[elementos.length];
    System.arraycopy(elementos, 0, datos, 0, elementos.length);
    return crearArreglo("INTEGER", datos);
  }

  protected Array crearArregloEnteroLargo(Object[] elementos)
          throws PersistenciaExcepcion
  {
    Object[] datos = new Object[elementos.length];
    System.arraycopy(elementos, 0, datos, 0, elementos.length);
    return crearArreglo("BIGINT", datos);
  }

  protected Array crearArreglo(String tipo, Object[] elementos)
          throws PersistenciaExcepcion
  {
    try {
      if (nulo(elementos)) {
        return null;
      }
      return cnn.createArrayOf(tipo, elementos);
    } catch (SQLException ex) {
      LogUtil.error(ex);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CREAR_ARREGLO);
    }
  }
}
