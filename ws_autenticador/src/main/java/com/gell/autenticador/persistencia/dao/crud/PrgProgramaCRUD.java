package com.gell.autenticador.persistencia.dao.crud;

import com.gell.autenticador.persistencia.basedatos.PostgresBD;
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

public class PrgProgramaCRUD extends GenericoCRUD {

  private final int ID = 1;

  public PrgProgramaCRUD(DataSource dataSource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(PostgresBD.getConexion(dataSource), auditoria);
  }

  public void insertar(PrgPrograma prgPrograma)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.prg_programa(prg_nombre,prg_localiza,prg_abreviatura,prg_version,prg_tipo,usu_ideregistro) VALUES (?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
      sentencia.setObject(i++, prgPrograma.getPrgNombre());
      sentencia.setObject(i++, prgPrograma.getPrgLocaliza());
      sentencia.setObject(i++, prgPrograma.getPrgAbreviatura());
      sentencia.setObject(i++, prgPrograma.getPrgVersion());
      sentencia.setObject(i++, prgPrograma.getPrgTipo());
      sentencia.setObject(i++, prgPrograma.getUsuIderegistro());

      sentencia.executeUpdate();
      ResultSet rs = sentencia.getGeneratedKeys();
      if (rs.next()) {
        prgPrograma.setPrgIderegistro(rs.getInt("prg_ideregistro"));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void insertarTodos(PrgPrograma prgPrograma)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.prg_programa(prg_ideregistro,prg_nombre,prg_localiza,prg_abreviatura,prg_version,prg_tipo,usu_ideregistro) VALUES (?,?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, prgPrograma.getPrgIderegistro());
      sentencia.setObject(i++, prgPrograma.getPrgNombre());
      sentencia.setObject(i++, prgPrograma.getPrgLocaliza());
      sentencia.setObject(i++, prgPrograma.getPrgAbreviatura());
      sentencia.setObject(i++, prgPrograma.getPrgVersion());
      sentencia.setObject(i++, prgPrograma.getPrgTipo());
      sentencia.setObject(i++, prgPrograma.getUsuIderegistro());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void editar(PrgPrograma prgPrograma)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "UPDATE public.prg_programa SET prg_nombre=?,prg_localiza=?,prg_abreviatura=?,prg_version=?,prg_tipo=?,usu_ideregistro=? where prg_ideregistro=? ";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, prgPrograma.getPrgNombre());
      sentencia.setObject(i++, prgPrograma.getPrgLocaliza());
      sentencia.setObject(i++, prgPrograma.getPrgAbreviatura());
      sentencia.setObject(i++, prgPrograma.getPrgVersion());
      sentencia.setObject(i++, prgPrograma.getPrgTipo());
      sentencia.setObject(i++, prgPrograma.getUsuIderegistro());
      sentencia.setObject(i++, prgPrograma.getPrgIderegistro());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public List<PrgPrograma> consultar()
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    List<PrgPrograma> lista = new ArrayList<>();
    try {

      String sql = "SELECT * FROM public.prg_programa";
      sentencia = cnn.prepareStatement(sql);
      ResultSet rs = sentencia.executeQuery();
      while (rs.next()) {
        lista.add(getPrgPrograma(rs));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return lista;

  }

  public PrgPrograma consultar(long id)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    PrgPrograma obj = null;
    try {

      String sql = "SELECT * FROM public.prg_programa WHERE prg_ideregistro=?";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setLong(1, id);
      ResultSet rs = sentencia.executeQuery();
      if (rs.next()) {
        obj = getPrgPrograma(rs);
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return obj;
  }

  public static PrgPrograma getPrgPrograma(ResultSet rs)
          throws PersistenciaExcepcion
  {
    PrgPrograma prgPrograma = new PrgPrograma();
    prgPrograma.setPrgIderegistro(getObject("prg_ideregistro", Integer.class, rs));
    prgPrograma.setPrgNombre(getObject("prg_nombre", String.class, rs));
    prgPrograma.setPrgLocaliza(getObject("prg_localiza", String.class, rs));
    prgPrograma.setPrgAbreviatura(getObject("prg_abreviatura", String.class, rs));
    prgPrograma.setPrgVersion(getObject("prg_version", String.class, rs));
    prgPrograma.setPrgTipo(getObject("prg_tipo", String.class, rs));
    prgPrograma.setUsuIderegistro(getObject("usu_ideregistro", Integer.class, rs));

    return prgPrograma;
  }

  public static void getPrgPrograma(ResultSet rs, Map<String, Integer> columnas, PrgPrograma prgPrograma)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get("prg_programa_prg_ideregistro");
    if (columna != null) {
      prgPrograma.setPrgIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get("prg_programa_prg_nombre");
    if (columna != null) {
      prgPrograma.setPrgNombre(getObject(columna, String.class, rs));
    }
    columna = columnas.get("prg_programa_prg_localiza");
    if (columna != null) {
      prgPrograma.setPrgLocaliza(getObject(columna, String.class, rs));
    }
    columna = columnas.get("prg_programa_prg_abreviatura");
    if (columna != null) {
      prgPrograma.setPrgAbreviatura(getObject(columna, String.class, rs));
    }
    columna = columnas.get("prg_programa_prg_version");
    if (columna != null) {
      prgPrograma.setPrgVersion(getObject(columna, String.class, rs));
    }
    columna = columnas.get("prg_programa_prg_tipo");
    if (columna != null) {
      prgPrograma.setPrgTipo(getObject(columna, String.class, rs));
    }
    columna = columnas.get("prg_programa_usu_ideregistro");
    if (columna != null) {
      prgPrograma.setUsuIderegistro(getObject(columna, Integer.class, rs));
    }
  }

  public static void getPrgPrograma(ResultSet rs, Map<String, Integer> columnas, PrgPrograma prgPrograma, String alias)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get(alias + "_prg_ideregistro");
    if (columna != null) {
      prgPrograma.setPrgIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get(alias + "_prg_nombre");
    if (columna != null) {
      prgPrograma.setPrgNombre(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_prg_localiza");
    if (columna != null) {
      prgPrograma.setPrgLocaliza(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_prg_abreviatura");
    if (columna != null) {
      prgPrograma.setPrgAbreviatura(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_prg_version");
    if (columna != null) {
      prgPrograma.setPrgVersion(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_prg_tipo");
    if (columna != null) {
      prgPrograma.setPrgTipo(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usu_ideregistro");
    if (columna != null) {
      prgPrograma.setUsuIderegistro(getObject(columna, Integer.class, rs));
    }
  }

  public static PrgPrograma getPrgPrograma(ResultSet rs, Map<String, Integer> columnas)
          throws PersistenciaExcepcion
  {
    PrgPrograma prgPrograma = new PrgPrograma();
    getPrgPrograma(rs, columnas, prgPrograma);
    return prgPrograma;
  }

  public static PrgPrograma getPrgPrograma(ResultSet rs, Map<String, Integer> columnas, String alias)
          throws PersistenciaExcepcion
  {
    PrgPrograma prgPrograma = new PrgPrograma();
    getPrgPrograma(rs, columnas, prgPrograma, alias);
    return prgPrograma;
  }

}
