package com.gell.autenticador.persistencia.dao.crud;

import com.gell.autenticador.persistencia.basedatos.PostgresBD;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import com.gell.estandar.persistencia.entidades.PrgPrograma;
import com.gell.estandar.persistencia.abstracto.GenericoCRUD;
import com.gell.estandar.util.LogUtil;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;
import java.sql.Statement;
import java.util.Map;
import javax.sql.DataSource;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;

public class OpcOpcionCRUD extends GenericoCRUD {

  private final int ID = 1;

  public OpcOpcionCRUD(DataSource dataSource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(PostgresBD.getConexion(dataSource), auditoria);
  }

  public void insertar(OpcOpcion opcOpcion)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.opc_opcion(opc_nombre,opc_descripcion,prg_ideregistro,opc_idepadre,usu_ideregistro,opc_tipo) VALUES (?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
      sentencia.setObject(i++, opcOpcion.getOpcNombre());
      sentencia.setObject(i++, opcOpcion.getOpcDescripcion());
      Object prgIderegistro = (opcOpcion.getPrgIderegistro() == null) ? null : opcOpcion.getPrgIderegistro().getPrgIderegistro();
      sentencia.setObject(i++, prgIderegistro);
      Object opcIdepadre = (opcOpcion.getOpcIdepadre() == null) ? null : opcOpcion.getOpcIdepadre().getOpcIderegistro();
      sentencia.setObject(i++, opcIdepadre);
      sentencia.setObject(i++, opcOpcion.getUsuIderegistro());
      sentencia.setObject(i++, opcOpcion.getOpcTipo());

      sentencia.executeUpdate();
      ResultSet rs = sentencia.getGeneratedKeys();
      if (rs.next()) {
        opcOpcion.setOpcIderegistro(rs.getInt("opc_ideregistro"));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void insertarTodos(OpcOpcion opcOpcion)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.opc_opcion(opc_ideregistro,opc_nombre,opc_descripcion,prg_ideregistro,opc_idepadre,usu_ideregistro,opc_tipo) VALUES (?,?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, opcOpcion.getOpcIderegistro());
      sentencia.setObject(i++, opcOpcion.getOpcNombre());
      sentencia.setObject(i++, opcOpcion.getOpcDescripcion());
      Object prgIderegistro = (opcOpcion.getPrgIderegistro() == null) ? null : opcOpcion.getPrgIderegistro().getPrgIderegistro();
      sentencia.setObject(i++, prgIderegistro);
      Object opcIdepadre = (opcOpcion.getOpcIdepadre() == null) ? null : opcOpcion.getOpcIdepadre().getOpcIderegistro();
      sentencia.setObject(i++, opcIdepadre);
      sentencia.setObject(i++, opcOpcion.getUsuIderegistro());
      sentencia.setObject(i++, opcOpcion.getOpcTipo());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void editar(OpcOpcion opcOpcion)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "UPDATE public.opc_opcion SET opc_nombre=?,opc_descripcion=?,prg_ideregistro=?,opc_idepadre=?,usu_ideregistro=?,opc_tipo=? where opc_ideregistro=? ";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, opcOpcion.getOpcNombre());
      sentencia.setObject(i++, opcOpcion.getOpcDescripcion());
      Object prgIderegistro = (opcOpcion.getPrgIderegistro() == null) ? null : opcOpcion.getPrgIderegistro().getPrgIderegistro();
      sentencia.setObject(i++, prgIderegistro);
      Object opcIdepadre = (opcOpcion.getOpcIdepadre() == null) ? null : opcOpcion.getOpcIdepadre().getOpcIderegistro();
      sentencia.setObject(i++, opcIdepadre);
      sentencia.setObject(i++, opcOpcion.getUsuIderegistro());
      sentencia.setObject(i++, opcOpcion.getOpcTipo());
      sentencia.setObject(i++, opcOpcion.getOpcIderegistro());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public List<OpcOpcion> consultar()
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    List<OpcOpcion> lista = new ArrayList<>();
    try {

      String sql = "SELECT * FROM public.opc_opcion";
      sentencia = cnn.prepareStatement(sql);
      ResultSet rs = sentencia.executeQuery();
      while (rs.next()) {
        lista.add(getOpcOpcion(rs));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return lista;

  }

  public OpcOpcion consultar(long id)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    OpcOpcion obj = null;
    try {

      String sql = "SELECT * FROM public.opc_opcion WHERE opc_ideregistro=?";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setLong(1, id);
      ResultSet rs = sentencia.executeQuery();
      if (rs.next()) {
        obj = getOpcOpcion(rs);
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return obj;
  }

  public static OpcOpcion getOpcOpcion(ResultSet rs)
          throws PersistenciaExcepcion
  {
    OpcOpcion opcOpcion = new OpcOpcion();
    opcOpcion.setOpcIderegistro(getObject("opc_ideregistro", Integer.class, rs));
    opcOpcion.setOpcNombre(getObject("opc_nombre", String.class, rs));
    opcOpcion.setOpcDescripcion(getObject("opc_descripcion", String.class, rs));
    PrgPrograma prg_ideregistro = new PrgPrograma();
    prg_ideregistro.setPrgIderegistro(getObject("prg_ideregistro", Integer.class, rs));
    opcOpcion.setPrgIderegistro(prg_ideregistro);
    OpcOpcion opc_idepadre = new OpcOpcion();
    opc_idepadre.setOpcIderegistro(getObject("opc_idepadre", Integer.class, rs));
    opcOpcion.setOpcIdepadre(opc_idepadre);
    opcOpcion.setUsuIderegistro(getObject("usu_ideregistro", Integer.class, rs));
    opcOpcion.setOpcTipo(getObject("opc_tipo", Integer.class, rs));

    return opcOpcion;
  }

  public static void getOpcOpcion(ResultSet rs, Map<String, Integer> columnas, OpcOpcion opcOpcion)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get("opc_opcion_opc_ideregistro");
    if (columna != null) {
      opcOpcion.setOpcIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get("opc_opcion_opc_nombre");
    if (columna != null) {
      opcOpcion.setOpcNombre(getObject(columna, String.class, rs));
    }
    columna = columnas.get("opc_opcion_opc_descripcion");
    if (columna != null) {
      opcOpcion.setOpcDescripcion(getObject(columna, String.class, rs));
    }
    columna = columnas.get("opc_opcion_prg_ideregistro");
    if (columna != null) {
      PrgPrograma prg_ideregistro = new PrgPrograma();
      prg_ideregistro.setPrgIderegistro(getObject(columna, Integer.class, rs));
      opcOpcion.setPrgIderegistro(prg_ideregistro);
    }
    columna = columnas.get("opc_opcion_opc_idepadre");
    if (columna != null) {
      OpcOpcion opc_idepadre = new OpcOpcion();
      opc_idepadre.setOpcIderegistro(getObject(columna, Integer.class, rs));
      opcOpcion.setOpcIdepadre(opc_idepadre);
    }
    columna = columnas.get("opc_opcion_usu_ideregistro");
    if (columna != null) {
      opcOpcion.setUsuIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get("opc_opcion_opc_tipo");
    if (columna != null) {
      opcOpcion.setOpcTipo(getObject(columna, Integer.class, rs));
    }
  }

  public static void getOpcOpcion(ResultSet rs, Map<String, Integer> columnas, OpcOpcion opcOpcion, String alias)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get(alias + "_opc_ideregistro");
    if (columna != null) {
      opcOpcion.setOpcIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get(alias + "_opc_nombre");
    if (columna != null) {
      opcOpcion.setOpcNombre(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_opc_descripcion");
    if (columna != null) {
      opcOpcion.setOpcDescripcion(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usu_ideregistro");
    if (columna != null) {
      opcOpcion.setUsuIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get(alias + "_opc_tipo");
    if (columna != null) {
      opcOpcion.setOpcTipo(getObject(columna, Integer.class, rs));
    }
  }

  public static OpcOpcion getOpcOpcion(ResultSet rs, Map<String, Integer> columnas)
          throws PersistenciaExcepcion
  {
    OpcOpcion opcOpcion = new OpcOpcion();
    getOpcOpcion(rs, columnas, opcOpcion);
    return opcOpcion;
  }

  public static OpcOpcion getOpcOpcion(ResultSet rs, Map<String, Integer> columnas, String alias)
          throws PersistenciaExcepcion
  {
    OpcOpcion opcOpcion = new OpcOpcion();
    getOpcOpcion(rs, columnas, opcOpcion, alias);
    return opcOpcion;
  }

}
