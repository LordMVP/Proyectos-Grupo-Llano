package com.gell.autenticador.persistencia.dao.crud;

import com.gell.autenticador.persistencia.basedatos.PostgresBD;
import com.gell.estandar.persistencia.entidades.AccAcceso;
import com.gell.estandar.persistencia.entidades.Usuarios;
import com.gell.estandar.persistencia.abstracto.GenericoCRUD;
import com.gell.estandar.util.LogUtil;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import java.sql.Statement;
import java.util.Map;
import java.sql.Timestamp;
import javax.sql.DataSource;
import com.gell.estandar.util.DateUtil;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;

public class AccAccesoCRUD extends GenericoCRUD {

  private final int ID = 1;

  public AccAccesoCRUD(DataSource dataSource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(PostgresBD.getConexion(dataSource), auditoria);
  }

  public void insertar(AccAcceso accAcceso)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.acc_acceso(usu_ideregistro,acc_fecingreso,acc_fecsalida,acc_estado,emp_ideregistro,pfi_ideregistro,acc_observacion) VALUES (?,?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
      Object usuIderegistro = (accAcceso.getUsuIderegistro() == null) ? null : accAcceso.getUsuIderegistro().getUsuIderegistro();
      sentencia.setObject(i++, usuIderegistro);
      sentencia.setObject(i++, DateUtil.parseTimestamp(accAcceso.getAccFecingreso()));
      sentencia.setObject(i++, DateUtil.parseTimestamp(accAcceso.getAccFecsalida()));
      sentencia.setObject(i++, accAcceso.getAccEstado());
      sentencia.setObject(i++, accAcceso.getEmpIderegistro());
      sentencia.setObject(i++, accAcceso.getPfiIderegistro());
      sentencia.setObject(i++, accAcceso.getAccObservacion());

      sentencia.executeUpdate();
      ResultSet rs = sentencia.getGeneratedKeys();
      if (rs.next()) {
        accAcceso.setAccIderegistro(rs.getLong(ID));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void insertarTodos(AccAcceso accAcceso)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.acc_acceso(acc_ideregistro,usu_ideregistro,acc_fecingreso,acc_fecsalida,acc_estado,emp_ideregistro,pfi_ideregistro,acc_observacion) VALUES (?,?,?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, accAcceso.getAccIderegistro());
      Object usuIderegistro = (accAcceso.getUsuIderegistro() == null) ? null : accAcceso.getUsuIderegistro().getUsuIderegistro();
      sentencia.setObject(i++, usuIderegistro);
      sentencia.setObject(i++, DateUtil.parseTimestamp(accAcceso.getAccFecingreso()));
      sentencia.setObject(i++, DateUtil.parseTimestamp(accAcceso.getAccFecsalida()));
      sentencia.setObject(i++, accAcceso.getAccEstado());
      sentencia.setObject(i++, accAcceso.getEmpIderegistro());
      sentencia.setObject(i++, accAcceso.getPfiIderegistro());
      sentencia.setObject(i++, accAcceso.getAccObservacion());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void editar(AccAcceso accAcceso)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "UPDATE public.acc_acceso SET usu_ideregistro=?,acc_fecingreso=?,acc_fecsalida=?,acc_estado=?,emp_ideregistro=?,pfi_ideregistro=?,acc_observacion=? where acc_ideregistro=? ";
      sentencia = cnn.prepareStatement(sql);
      Object usuIderegistro = (accAcceso.getUsuIderegistro() == null) ? null : accAcceso.getUsuIderegistro().getUsuIderegistro();
      sentencia.setObject(i++, usuIderegistro);
      sentencia.setObject(i++, DateUtil.parseTimestamp(accAcceso.getAccFecingreso()));
      sentencia.setObject(i++, DateUtil.parseTimestamp(accAcceso.getAccFecsalida()));
      sentencia.setObject(i++, accAcceso.getAccEstado());
      sentencia.setObject(i++, accAcceso.getEmpIderegistro());
      sentencia.setObject(i++, accAcceso.getPfiIderegistro());
      sentencia.setObject(i++, accAcceso.getAccObservacion());
      sentencia.setObject(i++, accAcceso.getAccIderegistro());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public List<AccAcceso> consultar()
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    List<AccAcceso> lista = new ArrayList<>();
    try {

      String sql = "SELECT * FROM public.acc_acceso";
      sentencia = cnn.prepareStatement(sql);
      ResultSet rs = sentencia.executeQuery();
      while (rs.next()) {
        lista.add(getAccAcceso(rs));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return lista;

  }

  public AccAcceso consultar(long id)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    AccAcceso obj = null;
    try {

      String sql = "SELECT * FROM public.acc_acceso WHERE acc_ideregistro=?";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setLong(1, id);
      ResultSet rs = sentencia.executeQuery();
      if (rs.next()) {
        obj = getAccAcceso(rs);
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return obj;
  }

  public static AccAcceso getAccAcceso(ResultSet rs)
          throws PersistenciaExcepcion
  {
    AccAcceso accAcceso = new AccAcceso();
    accAcceso.setAccIderegistro(getObject("acc_ideregistro", Long.class, rs));
    Usuarios usu_ideregistro = new Usuarios();
    usu_ideregistro.setUsuIderegistro(getObject("usu_ideregistro", Integer.class, rs));
    accAcceso.setUsuIderegistro(usu_ideregistro);
    accAcceso.setAccFecingreso(getObject("acc_fecingreso", Timestamp.class, rs));
    accAcceso.setAccFecsalida(getObject("acc_fecsalida", Timestamp.class, rs));
    accAcceso.setAccEstado(getObject("acc_estado", String.class, rs));
    accAcceso.setEmpIderegistro(getObject("emp_ideregistro", Integer.class, rs));
    accAcceso.setPfiIderegistro(getObject("pfi_ideregistro", Integer.class, rs));
    accAcceso.setAccObservacion(getObject("acc_observacion", String.class, rs));

    return accAcceso;
  }

  public static void getAccAcceso(ResultSet rs, Map<String, Integer> columnas, AccAcceso accAcceso)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get("acc_acceso_acc_ideregistro");
    if (columna != null) {
      accAcceso.setAccIderegistro(getObject(columna, Long.class, rs));
    }
    columna = columnas.get("acc_acceso_usu_ideregistro");
    if (columna != null) {
      Usuarios usu_ideregistro = new Usuarios();
      usu_ideregistro.setUsuIderegistro(getObject(columna, Integer.class, rs));
      accAcceso.setUsuIderegistro(usu_ideregistro);
    }
    columna = columnas.get("acc_acceso_acc_fecingreso");
    if (columna != null) {
      accAcceso.setAccFecingreso(getObject(columna, Timestamp.class, rs));
    }
    columna = columnas.get("acc_acceso_acc_fecsalida");
    if (columna != null) {
      accAcceso.setAccFecsalida(getObject(columna, Timestamp.class, rs));
    }
    columna = columnas.get("acc_acceso_acc_estado");
    if (columna != null) {
      accAcceso.setAccEstado(getObject(columna, String.class, rs));
    }
    columna = columnas.get("acc_acceso_emp_ideregistro");
    if (columna != null) {
      accAcceso.setEmpIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get("acc_acceso_pfi_ideregistro");
    if (columna != null) {
      accAcceso.setPfiIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get("acc_acceso_acc_observacion");
    if (columna != null) {
      accAcceso.setAccObservacion(getObject(columna, String.class, rs));
    }
  }

  public static void getAccAcceso(ResultSet rs, Map<String, Integer> columnas, AccAcceso accAcceso, String alias)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get(alias + "_acc_ideregistro");
    if (columna != null) {
      accAcceso.setAccIderegistro(getObject(columna, Long.class, rs));
    }
    columna = columnas.get(alias + "_acc_fecingreso");
    if (columna != null) {
      accAcceso.setAccFecingreso(getObject(columna, Timestamp.class, rs));
    }
    columna = columnas.get(alias + "_acc_fecsalida");
    if (columna != null) {
      accAcceso.setAccFecsalida(getObject(columna, Timestamp.class, rs));
    }
    columna = columnas.get(alias + "_acc_estado");
    if (columna != null) {
      accAcceso.setAccEstado(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_emp_ideregistro");
    if (columna != null) {
      accAcceso.setEmpIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get(alias + "_pfi_ideregistro");
    if (columna != null) {
      accAcceso.setPfiIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get(alias + "_acc_observacion");
    if (columna != null) {
      accAcceso.setAccObservacion(getObject(columna, String.class, rs));
    }
  }

  public static AccAcceso getAccAcceso(ResultSet rs, Map<String, Integer> columnas)
          throws PersistenciaExcepcion
  {
    AccAcceso accAcceso = new AccAcceso();
    getAccAcceso(rs, columnas, accAcceso);
    return accAcceso;
  }

  public static AccAcceso getAccAcceso(ResultSet rs, Map<String, Integer> columnas, String alias)
          throws PersistenciaExcepcion
  {
    AccAcceso accAcceso = new AccAcceso();
    getAccAcceso(rs, columnas, accAcceso, alias);
    return accAcceso;
  }

}
