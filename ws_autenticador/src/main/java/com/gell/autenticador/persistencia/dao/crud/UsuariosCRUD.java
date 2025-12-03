package com.gell.autenticador.persistencia.dao.crud;

import com.gell.autenticador.persistencia.basedatos.PostgresBD;
import com.gell.estandar.persistencia.entidades.Empresas;
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
import javax.sql.DataSource;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;

public class UsuariosCRUD extends GenericoCRUD {

  private final int ID = 1;

  public UsuariosCRUD(DataSource dataSource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(PostgresBD.getConexion(dataSource), auditoria);
  }

  public void insertar(Usuarios usuarios)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.usuarios(usuario_nit,usuario_nom,usuario_codcar,usuario_codper,usuario_pas,usuario_codemp,usuario_coddepemp,usuario_swtact,usuario_mail,usuario_swtcar,usuario_swtper,usuario_codpro,usu_topfinancia,usu_modrecexterno,usu_finvencido,usu_login) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
      sentencia.setObject(i++, usuarios.getUsuarioNit());
      sentencia.setObject(i++, usuarios.getUsuarioNom());
      sentencia.setObject(i++, usuarios.getUsuarioCodcar());
      sentencia.setObject(i++, usuarios.getUsuarioCodper());
      sentencia.setObject(i++, usuarios.getUsuarioPas());
      Object usuarioCodemp = (usuarios.getUsuarioCodemp() == null) ? null : usuarios.getUsuarioCodemp().getEmpresaCod();
      sentencia.setObject(i++, usuarioCodemp);
      sentencia.setObject(i++, usuarios.getUsuarioCoddepemp());
      sentencia.setObject(i++, usuarios.getUsuarioSwtact());
      sentencia.setObject(i++, usuarios.getUsuarioMail());
      sentencia.setObject(i++, usuarios.getUsuarioSwtcar());
      sentencia.setObject(i++, usuarios.getUsuarioSwtper());
      sentencia.setObject(i++, usuarios.getUsuarioCodpro());
      sentencia.setObject(i++, usuarios.getUsuTopfinancia());
      sentencia.setObject(i++, usuarios.getUsuModrecexterno());
      sentencia.setObject(i++, usuarios.getUsuFinvencido());
      sentencia.setObject(i++, usuarios.getUsuLogin());

      sentencia.executeUpdate();
      ResultSet rs = sentencia.getGeneratedKeys();
      if (rs.next()) {
        usuarios.setUsuIderegistro(rs.getInt("usu_ideregistro"));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void insertarTodos(Usuarios usuarios)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "INSERT INTO public.usuarios(usuario_nit,usuario_nom,usuario_codcar,usuario_codper,usuario_pas,usuario_codemp,usuario_coddepemp,usuario_swtact,usuario_mail,usuario_swtcar,usuario_swtper,usuario_codpro,usu_topfinancia,usu_modrecexterno,usu_ideregistro,usu_finvencido,usu_login) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, usuarios.getUsuarioNit());
      sentencia.setObject(i++, usuarios.getUsuarioNom());
      sentencia.setObject(i++, usuarios.getUsuarioCodcar());
      sentencia.setObject(i++, usuarios.getUsuarioCodper());
      sentencia.setObject(i++, usuarios.getUsuarioPas());
      Object usuarioCodemp = (usuarios.getUsuarioCodemp() == null) ? null : usuarios.getUsuarioCodemp().getEmpresaCod();
      sentencia.setObject(i++, usuarioCodemp);
      sentencia.setObject(i++, usuarios.getUsuarioCoddepemp());
      sentencia.setObject(i++, usuarios.getUsuarioSwtact());
      sentencia.setObject(i++, usuarios.getUsuarioMail());
      sentencia.setObject(i++, usuarios.getUsuarioSwtcar());
      sentencia.setObject(i++, usuarios.getUsuarioSwtper());
      sentencia.setObject(i++, usuarios.getUsuarioCodpro());
      sentencia.setObject(i++, usuarios.getUsuTopfinancia());
      sentencia.setObject(i++, usuarios.getUsuModrecexterno());
      sentencia.setObject(i++, usuarios.getUsuIderegistro());
      sentencia.setObject(i++, usuarios.getUsuFinvencido());
      sentencia.setObject(i++, usuarios.getUsuLogin());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_INSERTAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public void editar(Usuarios usuarios)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    try {
      int i = 1;
      String sql = "UPDATE public.usuarios SET usuario_nit=?,usuario_nom=?,usuario_codcar=?,usuario_codper=?,usuario_pas=?,usuario_codemp=?,usuario_coddepemp=?,usuario_swtact=?,usuario_mail=?,usuario_swtcar=?,usuario_swtper=?,usuario_codpro=?,usu_topfinancia=?,usu_modrecexterno=?,usu_finvencido=?,usu_login=? where usu_ideregistro=? ";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setObject(i++, usuarios.getUsuarioNit());
      sentencia.setObject(i++, usuarios.getUsuarioNom());
      sentencia.setObject(i++, usuarios.getUsuarioCodcar());
      sentencia.setObject(i++, usuarios.getUsuarioCodper());
      sentencia.setObject(i++, usuarios.getUsuarioPas());
      Object usuarioCodemp = (usuarios.getUsuarioCodemp() == null) ? null : usuarios.getUsuarioCodemp().getEmpresaCod();
      sentencia.setObject(i++, usuarioCodemp);
      sentencia.setObject(i++, usuarios.getUsuarioCoddepemp());
      sentencia.setObject(i++, usuarios.getUsuarioSwtact());
      sentencia.setObject(i++, usuarios.getUsuarioMail());
      sentencia.setObject(i++, usuarios.getUsuarioSwtcar());
      sentencia.setObject(i++, usuarios.getUsuarioSwtper());
      sentencia.setObject(i++, usuarios.getUsuarioCodpro());
      sentencia.setObject(i++, usuarios.getUsuTopfinancia());
      sentencia.setObject(i++, usuarios.getUsuModrecexterno());
      sentencia.setObject(i++, usuarios.getUsuFinvencido());
      sentencia.setObject(i++, usuarios.getUsuLogin());
      sentencia.setObject(i++, usuarios.getUsuIderegistro());

      sentencia.executeUpdate();
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
    } finally {
      desconectar(sentencia);
    }
  }

  public List<Usuarios> consultar()
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    List<Usuarios> lista = new ArrayList<>();
    try {

      String sql = "SELECT * FROM public.usuarios";
      sentencia = cnn.prepareStatement(sql);
      ResultSet rs = sentencia.executeQuery();
      while (rs.next()) {
        lista.add(getUsuarios(rs));
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return lista;

  }

  public Usuarios consultar(long id)
          throws PersistenciaExcepcion
  {
    PreparedStatement sentencia = null;
    Usuarios obj = null;
    try {

      String sql = "SELECT * FROM public.usuarios WHERE usu_ideregistro=?";
      sentencia = cnn.prepareStatement(sql);
      sentencia.setLong(1, id);
      ResultSet rs = sentencia.executeQuery();
      if (rs.next()) {
        obj = getUsuarios(rs);
      }
    } catch (SQLException e) {
      LogUtil.error(e);
      throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_CONSULTAR);
    } finally {
      desconectar(sentencia);
    }
    return obj;
  }

  public static Usuarios getUsuarios(ResultSet rs)
          throws PersistenciaExcepcion
  {
    Usuarios usuarios = new Usuarios();
    usuarios.setUsuarioNit(getObject("usuario_nit", String.class, rs));
    usuarios.setUsuarioNom(getObject("usuario_nom", String.class, rs));
    usuarios.setUsuarioCodcar(getObject("usuario_codcar", String.class, rs));
    usuarios.setUsuarioCodper(getObject("usuario_codper", String.class, rs));
    usuarios.setUsuarioPas(getObject("usuario_pas", String.class, rs));
    Empresas usuario_codemp = new Empresas();
    usuario_codemp.setEmpresaCod(getObject("usuario_codemp", String.class, rs));
    usuarios.setUsuarioCodemp(usuario_codemp);
    usuarios.setUsuarioCoddepemp(getObject("usuario_coddepemp", String.class, rs));
    usuarios.setUsuarioSwtact(getObject("usuario_swtact", Boolean.class, rs));
    usuarios.setUsuarioMail(getObject("usuario_mail", String.class, rs));
    usuarios.setUsuarioSwtcar(getObject("usuario_swtcar", Boolean.class, rs));
    usuarios.setUsuarioSwtper(getObject("usuario_swtper", Boolean.class, rs));
    usuarios.setUsuarioCodpro(getObject("usuario_codpro", String.class, rs));
    usuarios.setUsuTopfinancia(getObject("usu_topfinancia", Double.class, rs));
    usuarios.setUsuModrecexterno(getObject("usu_modrecexterno", String.class, rs));
    usuarios.setUsuIderegistro(getObject("usu_ideregistro", Integer.class, rs));
    usuarios.setUsuFinvencido(getObject("usu_finvencido", String.class, rs));
    usuarios.setUsuLogin(getObject("usu_login", String.class, rs));

    return usuarios;
  }

  public static void getUsuarios(ResultSet rs, Map<String, Integer> columnas, Usuarios usuarios)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get("usuarios_usuario_nit");
    if (columna != null) {
      usuarios.setUsuarioNit(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_nom");
    if (columna != null) {
      usuarios.setUsuarioNom(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_codcar");
    if (columna != null) {
      usuarios.setUsuarioCodcar(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_codper");
    if (columna != null) {
      usuarios.setUsuarioCodper(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_pas");
    if (columna != null) {
      usuarios.setUsuarioPas(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_codemp");
    if (columna != null) {

      Empresas usuario_codemp = new Empresas();
      usuario_codemp.setEmpresaCod(getObject("usuario_codemp", String.class, rs));
      usuarios.setUsuarioCodemp(usuario_codemp);
    }
    columna = columnas.get("usuarios_usuario_coddepemp");
    if (columna != null) {
      usuarios.setUsuarioCoddepemp(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_swtact");
    if (columna != null) {
      usuarios.setUsuarioSwtact(getObject(columna, Boolean.class, rs));
    }
    columna = columnas.get("usuarios_usuario_mail");
    if (columna != null) {
      usuarios.setUsuarioMail(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usuario_swtcar");
    if (columna != null) {
      usuarios.setUsuarioSwtcar(getObject(columna, Boolean.class, rs));
    }
    columna = columnas.get("usuarios_usuario_swtper");
    if (columna != null) {
      usuarios.setUsuarioSwtper(getObject(columna, Boolean.class, rs));
    }
    columna = columnas.get("usuarios_usuario_codpro");
    if (columna != null) {
      usuarios.setUsuarioCodpro(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usu_topfinancia");
    if (columna != null) {
      usuarios.setUsuTopfinancia(getObject(columna, Double.class, rs));
    }
    columna = columnas.get("usuarios_usu_modrecexterno");
    if (columna != null) {
      usuarios.setUsuModrecexterno(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usu_ideregistro");
    if (columna != null) {
      usuarios.setUsuIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get("usuarios_usu_finvencido");
    if (columna != null) {
      usuarios.setUsuFinvencido(getObject(columna, String.class, rs));
    }
    columna = columnas.get("usuarios_usu_login");
    if (columna != null) {
      usuarios.setUsuLogin(getObject(columna, String.class, rs));
    }
  }

  public static void getUsuarios(ResultSet rs, Map<String, Integer> columnas, Usuarios usuarios, String alias)
          throws PersistenciaExcepcion
  {
    Integer columna = columnas.get(alias + "_usuario_nit");
    if (columna != null) {
      usuarios.setUsuarioNit(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_nom");
    if (columna != null) {
      usuarios.setUsuarioNom(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_codcar");
    if (columna != null) {
      usuarios.setUsuarioCodcar(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_codper");
    if (columna != null) {
      usuarios.setUsuarioCodper(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_pas");
    if (columna != null) {
      usuarios.setUsuarioPas(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_coddepemp");
    if (columna != null) {
      usuarios.setUsuarioCoddepemp(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_swtact");
    if (columna != null) {
      usuarios.setUsuarioSwtact(getObject(columna, Boolean.class, rs));
    }
    columna = columnas.get(alias + "_usuario_mail");
    if (columna != null) {
      usuarios.setUsuarioMail(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usuario_swtcar");
    if (columna != null) {
      usuarios.setUsuarioSwtcar(getObject(columna, Boolean.class, rs));
    }
    columna = columnas.get(alias + "_usuario_swtper");
    if (columna != null) {
      usuarios.setUsuarioSwtper(getObject(columna, Boolean.class, rs));
    }
    columna = columnas.get(alias + "_usuario_codpro");
    if (columna != null) {
      usuarios.setUsuarioCodpro(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usu_topfinancia");
    if (columna != null) {
      usuarios.setUsuTopfinancia(getObject(columna, Double.class, rs));
    }
    columna = columnas.get(alias + "_usu_modrecexterno");
    if (columna != null) {
      usuarios.setUsuModrecexterno(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usu_ideregistro");
    if (columna != null) {
      usuarios.setUsuIderegistro(getObject(columna, Integer.class, rs));
    }
    columna = columnas.get(alias + "_usu_finvencido");
    if (columna != null) {
      usuarios.setUsuFinvencido(getObject(columna, String.class, rs));
    }
    columna = columnas.get(alias + "_usu_login");
    if (columna != null) {
      usuarios.setUsuLogin(getObject(columna, String.class, rs));
    }
  }

  public static Usuarios getUsuarios(ResultSet rs, Map<String, Integer> columnas)
          throws PersistenciaExcepcion
  {
    Usuarios usuarios = new Usuarios();
    getUsuarios(rs, columnas, usuarios);
    return usuarios;
  }

  public static Usuarios getUsuarios(ResultSet rs, Map<String, Integer> columnas, String alias)
          throws PersistenciaExcepcion
  {
    Usuarios usuarios = new Usuarios();
    getUsuarios(rs, columnas, usuarios, alias);
    return usuarios;
  }

}
