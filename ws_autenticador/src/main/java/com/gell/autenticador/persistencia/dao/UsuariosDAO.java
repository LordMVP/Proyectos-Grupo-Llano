package com.gell.autenticador.persistencia.dao;

import com.gell.autenticador.persistencia.constante.EMensajePersistencia;
import com.gell.autenticador.persistencia.dao.crud.UsuariosCRUD;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.persistencia.entidades.Usuarios;
import com.gell.estandar.persistencia.abstracto.ConsultaAdaptador;
import static com.gell.estandar.persistencia.abstracto.GenericoCRUD.getObject;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.util.LogUtil;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;
import javax.sql.DataSource;

public class UsuariosDAO extends UsuariosCRUD
{

  public UsuariosDAO(DataSource datasource, AuditoriaDTO auditoria)
          throws PersistenciaExcepcion
  {
    super(datasource, auditoria);
  }

  @Override
  public void insertar(Usuarios usuarios)
          throws PersistenciaExcepcion
  {
    usuarios.setUsuModrecexterno("N")
            .setUsuFinvencido("S");
    if (usuarios.getUsuIderegistro() == null) {
      super.insertar(usuarios);
      return;
    }
    super.editar(usuarios);
  }

  public AuditoriaDTO autenticar(AutenticacionDTO autenticacion)
          throws PersistenciaExcepcion
  {
    parametros.put("usuario", autenticacion.getUsuario());
    parametros.put("clave", autenticacion.getClave());
    parametros.put("idempresa", Integer.valueOf(autenticacion.getIdEmpresa()));
    String condicion = "";
    String idPerfil = auditoria.getParametro("idPerfil");
    if (idPerfil != null) {
      condicion = " AND pp.pfi_ideregistro = :idperfil ";
      parametros.put("idperfil", idPerfil);
    }
    StringBuilder sb = new StringBuilder();
    sb.append("SELECT ")
            .append("  us.usuario_nit     usuarionit, ")
            .append("  us.usuario_nom     usuario, ")
            .append("  pp.pfi_ideregistro idperfil, ")
            .append("  em.empresa_sevemp  idempresa, ")
            .append("  em.empresa_nom     nombreempresa, ")
            .append("  uu.usu_ideregistro idusuario ")
            .append("FROM usem_usuempresa uu ")
            .append("  INNER JOIN pfi_perfil pp ON pp.pfi_ideregistro = uu.pfi_ideregistro ")
            .append("  INNER JOIN usuarios us ON uu.usu_ideregistro = us.usu_ideregistro ")
            .append("  INNER JOIN empresas em ON uu.emp_ideregistro = em.empresa_sevemp ")
            .append("WHERE us.usu_login = :usuario ")
            .append("      AND em.empresa_sevemp = :idempresa ")
            .append("      AND us.usuario_pas = :clave ")
            .append("      AND us.usuario_swtact = TRUE ")
            .append(condicion);
    return ejecutarConsultaSimple(sb, parametros, new ConsultaAdaptador<AuditoriaDTO>()
    {
      @Override
      public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
              throws PersistenciaExcepcion
      {
        AuditoriaDTO auditoria = new AuditoriaDTO()
                .setIdEmpresa(getObject("idempresa", Integer.class, rs))
                .setIdUsuario(getObject("idusuario", Integer.class, rs))
                .setParametro("nombreEmpresa", getObject("nombreempresa", String.class, rs))
                .setParametro("idPerfil", getObject("idperfil", String.class, rs));
        return auditoria;
      }

      @Override
      public void sinResultados()
              throws PersistenciaExcepcion
      {
        throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_SESION);
      }

    });

  }

  /*
  *
  * */
  public AuditoriaDTO  autenticarRisise(AutenticacionDTO autenticacion)
          throws PersistenciaExcepcion
  {
      parametros.put("usuario", autenticacion.getUsuario());
      parametros.put("clave", autenticacion.getClave());
      parametros.put("idempresa", Integer.valueOf(autenticacion.getIdEmpresa()));
      String condicion = "";
      String idPerfil = auditoria.getParametro("idPerfil");
      if (idPerfil != null) {
          condicion = " AND pp.pfi_ideregistro = :idperfil ";
          parametros.put("idperfil", idPerfil);
      }
      StringBuilder sb = new StringBuilder();
      sb.append("SELECT ")
              .append("  us.usuario_nit     usuarionit, ")
              .append("  us.usuario_nom     usuario, ")
              .append("  pp.pfi_ideregistro idperfil, ")
              .append("  em.empresa_sevemp  idempresa, ")
              .append("  em.empresa_nom     nombreempresa, ")
              .append("  uu.usu_ideregistro idusuario ")
              .append("FROM risise.usem_usuempresa uu ")
              .append("  INNER JOIN risise.pfi_perfil pp ON pp.pfi_ideregistro = uu.pfi_ideregistro ")
              .append("  INNER JOIN risise.usuarios us ON uu.usu_ideregistro = us.usu_ideregistro ")
              .append("  INNER JOIN risise.empresas em ON uu.emp_ideregistro = em.empresa_sevemp ")
              .append("WHERE us.usu_login = :usuario ")
              .append("      AND em.empresa_sevemp = :idempresa ")
              .append("      AND us.usuario_pas = :clave ")
              .append("      AND us.usuario_swtact = TRUE ")
              .append(condicion);
      return ejecutarConsultaSimple(sb, parametros, new ConsultaAdaptador<AuditoriaDTO>()
      {
          @Override
          public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
                  throws PersistenciaExcepcion
          {
              AuditoriaDTO auditoria = new AuditoriaDTO()
                      .setIdEmpresa(getObject("idempresa", Integer.class, rs))
                      .setIdUsuario(getObject("idusuario", Integer.class, rs))
                      .setParametro("nombreEmpresa", getObject("nombreempresa", String.class, rs))
                      .setParametro("idPerfil", getObject("idperfil", String.class, rs));
              return auditoria;
          }

          @Override
          public void sinResultados()
                  throws PersistenciaExcepcion
          {
              throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_SESION);
          }

      });

  }

  /**
   * Se expone método de autenticación cuando el usuario ya ha iniciado sesión
   * desde la aplicación de prisma
   *
   * @param idAcceso
   * @return Información de la sesión
   * @throws PersistenciaExcepcion Error al consultar en la base de datos
   */
  public AuditoriaDTO autenticarSesionPrisma(Long idAcceso)
          throws PersistenciaExcepcion
  {
    parametros.put("idacceso", idAcceso);
    StringBuilder sb = new StringBuilder();
    sb.append("SELECT us.usuario_nit     usuarionit, ")
            .append("       us.usuario_nom     usuario, ")
            .append("       pp.pfi_ideregistro idperfil, ")
            .append("       em.empresa_sevemp  idempresa, ")
            .append("       em.empresa_nom     nombreempresa, ")
            .append("       uu.usu_ideregistro idusuario ")
            .append("FROM usem_usuempresa uu ")
            .append("       INNER JOIN pfi_perfil pp ON pp.pfi_ideregistro = uu.pfi_ideregistro ")
            .append("       INNER JOIN usuarios us ON uu.usu_ideregistro = us.usu_ideregistro ")
            .append("       INNER JOIN empresas em ON uu.emp_ideregistro = em.empresa_sevemp ")
            .append("       INNER JOIN acc_acceso aa on us.usu_ideregistro = aa.usu_ideregistro ")
            .append("WHERE aa.acc_ideregistro = :idacceso ")
            .append("  AND em.empresa_sevemp = aa.emp_ideregistro ")
            .append("  AND aa.acc_estado IN ('I','E') ")
            .append("  AND us.usuario_swtact = TRUE");
    return ejecutarConsultaSimple(sb, parametros, new ConsultaAdaptador<AuditoriaDTO>()
    {
      @Override
      public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
              throws PersistenciaExcepcion
      {
        AuditoriaDTO auditoria = new AuditoriaDTO()
                .setIdEmpresa(getObject("idempresa", Integer.class, rs))
                .setIdUsuario(getObject("idusuario", Integer.class, rs))
                .setParametro("nombreEmpresa", getObject("nombreempresa", String.class, rs))
                .setParametro("idPerfil", getObject("idperfil", String.class, rs));
        return auditoria;
      }

      @Override
      public void sinResultados()
              throws PersistenciaExcepcion
      {
        throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_SESION);
      }

    });

  }

  /**
   * Consulta el usuario por el nit
   *
   * @param nit Documento o nit del usuario
   * @return Información del usuario
   * @throws PersistenciaExcepcion Error al consultar
   */
  public Usuarios consultarPorNit(String nit)
          throws PersistenciaExcepcion
  {
    StringBuilder sql = new StringBuilder();
    sql.append("SELECT * ")
            .append("FROM usuarios usu ")
            .append("WHERE usu.usuario_nit = :usuarionit");
    parametros.put("usuarionit", nit);
    return ejecutarConsultaSimple(sql, parametros,
            (ResultSet rs, Map<String, Integer> columns)
            -> getUsuarios(rs));
  }

    public AuditoriaDTO inicioSesionIncain(AutenticacionDTO usuario)
            throws PersistenciaExcepcion
    {
        //Se agregan los parámetros al controlador de parámetros.
        parametros.put("codigoUsuario", usuario.getUsuario());
        parametros.put("clave", usuario.getClave());
        parametros.put("codigoEmpresa", usuario.getIdEmpresa());
        //Se crea la consulta...
        LogUtil.info(parametros.toString());
        StringBuilder sql = new StringBuilder();

        sql.append("    SELECT      tuu.USU_CODI, "
                + "                 grupo.EMP_CODI "
                + "     FROM 	TI_USU_USUA tuu "
                + "     INNER JOIN 	GN_USUAR usuario ON usuario.USU_CODI = tuu.USU_CODI "
                + "     INNER JOIN 	GN_REMGU grupo ON grupo.GRU_CODI = usuario.GRU_CODI "
                + "     WHERE 	tuu.USU_CODI = :codigoUsuario AND "
                + "                 tuu.USU_CLAV = :clave AND "
                + "                 grupo.EMP_CODI = :codigoEmpresa; ");

        return ejecutarConsultaSimple(sql, parametros, new ConsultaAdaptador<AuditoriaDTO>()
        {
            @Override
            public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
                    throws PersistenciaExcepcion
            {
              AuditoriaDTO usuario = new AuditoriaDTO();
              usuario.setParametro("usuario", getObject("USU_CODI", String.class, rs));
              //usuario.setIdEmpresa(getObject("EMP_CODI", Integer.class, rs));
              //usuario.setParametro("imei", getObject("IDE_Movil", String.class, rs));
              return usuario;
            }

            @Override
            public void sinResultados()
                    throws PersistenciaExcepcion
            {
              throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_AUTENTICACION);
            }

        });
    }
  
  
  public AuditoriaDTO inicioSesionDiro(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    //Se agregan los parámetros al controlador de parámetros.
    parametros.put("usuario", usuario.getUsuario());
    parametros.put("estado", 1);
    parametros.put("clave", usuario.getClave());
    parametros.put("activo", "A");
    
    //Se crea la consulta...
    LogUtil.info(parametros.toString());
    StringBuilder sql = new StringBuilder();
    
    sql.append("SELECT      top 1 usu.cod_empl usuarionit, ");
    sql.append("            usu.usu_nombre usuario, ");
    sql.append("            usem.pfi_ideregistro  idperfil, ");
    sql.append("            usem.emp_ideregistro idempresa, ");
    sql.append("            empr.nom_empr nombreempresa, ");
    sql.append("            usu.usu_login idusuario ");
    sql.append("FROM        diro.usu_usuario usu ");
    sql.append("INNER JOIN  dbo.nm_contr contr ON contr.cod_empl=usu.cod_empl ");
    sql.append("INNER JOIN  diro.usem_usuempresa usem ON usem.usu_ideregistro=usu.usu_ideregistro ");
    sql.append("INNER JOIN  dbo.gn_empre empr ON empr.cod_empr=usem.emp_ideregistro ");
    sql.append("WHERE       usu.usu_login = :usuario ");
    sql.append("    AND     usu.usu_estado = :estado ");
    sql.append("    AND     usu.usu_password = :clave ");
    sql.append("    AND     contr.ind_acti = :activo; ");
        
    return ejecutarConsultaSimple(sql, parametros, new ConsultaAdaptador<AuditoriaDTO>()
    {
      @Override
      public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
              throws PersistenciaExcepcion
      {
        AuditoriaDTO usuario = new AuditoriaDTO();
        usuario.setParametro("usuario", getObject("usuario", String.class, rs));
        return usuario;
      }

      @Override
      public void sinResultados()
              throws PersistenciaExcepcion
      {
        throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_AUTENTICACION);
      }

    });
  }
  
  public String  consultarCorreoUsuarioDiro(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("SELECT      usu_mail ");
    sql.append("FROM        diro.usu_usuario ");
    sql.append("WHERE       usu_login = ? ");
    sql.append("    AND     usu_estado = ? ");
        
    PreparedStatement sentencia = null;
    String correo = null;       
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getUsuario());
        sentencia.setObject(2, 1);
        
        ResultSet rs = sentencia.executeQuery();        
        
        if(rs.next()){
            correo = rs.getString("usu_mail");
        }
        
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return correo;
  }
  
  public String  consultarCorreoUsuarioHomafo(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("SELECT      usu_email ");
    sql.append("FROM        usuarios ");
    sql.append("WHERE       usu_login = ? ");
    //sql.append("    AND     usuario_swtact = ? ");
        
    PreparedStatement sentencia = null;
    String correo = null;       
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getUsuario());
        //sentencia.setObject(2, true);
        
        ResultSet rs = sentencia.executeQuery();        
        
        if(rs.next()){
            correo = rs.getString("usu_email");
        }
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return correo;
  }
  
  public String  consultarIdConfirmacionDiro(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("SELECT      usu_ideconfirmacion ");
    sql.append("FROM        diro.usu_usuario ");
    sql.append("WHERE       usu_login = ? ");
    sql.append("    AND     usu_estado = ? ");
        
    PreparedStatement sentencia = null;
    String idConfirmacion = null;       
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getUsuario());
        sentencia.setObject(2, 1);
        
        ResultSet rs = sentencia.executeQuery();        
        
        if(rs.next()){
            idConfirmacion = rs.getString("usu_ideconfirmacion");
        }
        
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return idConfirmacion;
  }
  
  public String  consultarIdConfirmacionHomafo(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("SELECT      usu_ideconfirmacion ");
    sql.append("FROM        usuarios ");
    sql.append("WHERE       usu_login = ? ");
    //sql.append("    AND     usuario_swtact = ? ");
        
    PreparedStatement sentencia = null;
    String idConfirmacion = null;       
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getUsuario());
        //sentencia.setObject(2, 1);
        
        ResultSet rs = sentencia.executeQuery();        
        
        if(rs.next()){
            idConfirmacion = rs.getString("usu_ideconfirmacion");
        }
        
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return idConfirmacion;
  }
  
  public AuditoriaDTO olvidarClaveDiro(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("UPDATE      diro.usu_usuario " );
    sql.append("SET         usu_ideconfirmacion = CONVERT(VARCHAR(32), HashBytes('MD5', CONVERT(varchar, getdate(),20)), 2), ");
    sql.append("            usu_expiraconfirmacion = DATEADD(minute, 10, getdate()) ");
    sql.append("where       usu_login = ? ");
    sql.append("    and     usu_estado = ? ");
        
    PreparedStatement sentencia = null;
    AuditoriaDTO auditoria = new AuditoriaDTO();
        
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getUsuario());
        sentencia.setObject(2, 1);
        
        int filasAfectadas = sentencia.executeUpdate();        
        
        if(filasAfectadas > 0 ){
            auditoria.setParametro("usuario", usuario.getUsuario());
        }
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return auditoria;
  }
  
  public AuditoriaDTO olvidarClaveHomafo(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("UPDATE      usuarios " );
    sql.append("SET         usu_ideconfirmacion = md5(cast(to_timestamp(current_timestamp ::varchar,'YYYY-MM-DD HH24:MI:SS') as varchar)) , ");
    sql.append("            usu_expiraconfirmacion = to_timestamp(current_timestamp ::varchar,'YYYY-MM-DD HH24:MI:SS') + interval '10 minutes' ");
    //sql.append("SET         usu_ideconfirmacion = CONVERT(VARCHAR(32), HashBytes('MD5', CONVERT(varchar, getdate(),20)), 2), ");
    //sql.append("            usu_expiraconfirmacion = DATEADD(minute, 10, getdate()) ");
    sql.append("where       usu_login = ? ");
    //sql.append("    and     usuario_swtact = ? ");
       
    PreparedStatement sentencia = null;
    AuditoriaDTO auditoria = new AuditoriaDTO();
        
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getUsuario());
        //sentencia.setObject(2, 1);
        
        int filasAfectadas = sentencia.executeUpdate();        
        
        if(filasAfectadas > 0 ){
            auditoria.setParametro("usuario", usuario.getUsuario());
        }
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return auditoria;
  }
  
  public AuditoriaDTO cambiarClaveDiro(AutenticacionDTO usuario, String idConfirmacion)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("UPDATE      diro.usu_usuario " );
    sql.append("SET         usu_password = ?, ");
    sql.append("            usu_ideconfirmacion = ?, ");
    sql.append("            usu_expiraconfirmacion = ? ");
    sql.append("where       usu_login = ? ");
    sql.append("    and     usu_estado = ? ");
    sql.append("    and     usu_ideconfirmacion = ? ");
    
        
    PreparedStatement sentencia = null;
    AuditoriaDTO auditoria = new AuditoriaDTO();
        
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getClave());
        sentencia.setObject(2, null);
        sentencia.setObject(3, null);
        sentencia.setObject(4, usuario.getUsuario());
        sentencia.setObject(5, 1);
        sentencia.setObject(6, idConfirmacion);
        
        
        int filasAfectadas = sentencia.executeUpdate();        
        
        if(filasAfectadas > 0 ){
            auditoria.setParametro("usuario", usuario.getUsuario());
        }
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return auditoria;
  }
  
  public AuditoriaDTO cambiarClaveHomafo(AutenticacionDTO usuario, String idConfirmacion)
          throws PersistenciaExcepcion
  {
    
    //Se crea la consulta...
    StringBuilder sql = new StringBuilder();
    
    sql.append("UPDATE      usuarios " );
    sql.append("SET         usuario_pas = ?, ");
    sql.append("            usu_ideconfirmacion = ?, ");
    sql.append("            usu_expiraconfirmacion = ? ");
    sql.append("where       usu_login = ? ");
    //sql.append("    and     usuario_swtact = ? ");
    sql.append("    and     usu_ideconfirmacion = ? ");
    
        
    PreparedStatement sentencia = null;
    AuditoriaDTO auditoria = new AuditoriaDTO();
        
    
    try{    
        sentencia = cnn.prepareStatement(sql.toString());
        sentencia.setObject(1, usuario.getClave());
        sentencia.setObject(2, null);
        sentencia.setObject(3, null);
        sentencia.setObject(4, usuario.getUsuario());
        //sentencia.setObject(5, 1);
        sentencia.setObject(5, idConfirmacion);
        
        
        int filasAfectadas = sentencia.executeUpdate();        
        
        if(filasAfectadas > 0 ){
            auditoria.setParametro("usuario", usuario.getUsuario());
        }
        
    } catch(SQLException sqlEx) {
        
        LogUtil.error(sqlEx);
        throw new PersistenciaExcepcion(EMensajeEstandar.ERROR_EDITAR);
      
    } finally {
        desconectar(sentencia);
    }
    
    return auditoria;
  }
  
  
  /**
   * Se consulta el usuario por medio de un código, clave y un imei.
   *
   * @param codigoUsuario
   * @param clave
   * @param imei
   * @return
   * @throws PersistenciaExcepcion
   */
  public AuditoriaDTO inicioSesionInfis(AutenticacionDTO usuario)
          throws PersistenciaExcepcion
  {
    //Se agregan los parámetros al controlador de parámetros.
    parametros.put("codigoUsuario", usuario.getUsuario());
    parametros.put("clave", usuario.getClave());
    parametros.put("imei", usuario.getParametro("imei"));
    parametros.put("estado", "A");
    parametros.put("codigoEmpresa", usuario.getIdEmpresa());
    //Se crea la consulta...
    LogUtil.info(parametros.toString());
    StringBuilder sql = new StringBuilder();
    
    sql.append("    SELECT      tuu.USU_CODI, "
            + "                 tum.MOV_IDE, "
            + "                 grupo.EMP_CODI "
            + "     FROM 	TI_USU_USUA tuu "
            + "     INNER JOIN 	TI_USU_MOVIL tum ON tum.USU_CODI  = tuu.USU_CODI "
            + "         AND 	tum.MOV_IDE = :imei "
            + "     INNER JOIN 	GN_USUAR usuario ON usuario.USU_CODI = tuu.USU_CODI "
            + "     INNER JOIN 	GN_REMGU grupo ON grupo.GRU_CODI = usuario.GRU_CODI "
            + "     WHERE 	tuu.USU_CODI = :codigoUsuario AND "
            + "                 tuu.USU_CLAV = :clave AND "
            + "                 tuu.USU_ESTA = :estado AND "
            + "                 grupo.EMP_CODI = :codigoEmpresa; ");
   
    return ejecutarConsultaSimple(sql, parametros, new ConsultaAdaptador<AuditoriaDTO>()
    {
      @Override
      public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
              throws PersistenciaExcepcion
      {
        AuditoriaDTO usuario = new AuditoriaDTO();
        usuario.setParametro("usuario", getObject("USU_CODI", String.class, rs));
        usuario.setIdEmpresa(getObject("EMP_CODI", Integer.class, rs));
        usuario.setParametro("imei", getObject("MOV_IDE", String.class, rs));
        return usuario;
      }

      @Override
      public void sinResultados()
              throws PersistenciaExcepcion
      {
        throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_AUTENTICACION);
      }

    });
  }

  /**
   * Realiza la consulta de las credenciales de un usuario externo para el
   * ingreso de nominaciones
   *
   * @param autenticacion
   * @return nuevo objeto de Auditoria
   * @throws PersistenciaExcepcion
   */
  public AuditoriaDTO autenticarExternoNocon(AutenticacionDTO autenticacion)
          throws PersistenciaExcepcion
  {
    StringBuilder sql = new StringBuilder();
    sql.append("SELECT us.usuario_nit     usuarionit, ")
            .append("       us.usuario_nom     usuario, ")
            .append("       pp.pfi_ideregistro idperfil, ")
            .append("       em.empresa_sevemp  idempresa, ")
            .append("       em.empresa_nom     nombreempresa, ")
            .append("       uu.usu_ideregistro idusuario ")
            .append("FROM usem_usuempresa uu ")
            .append("       INNER JOIN pfi_perfil pp ON pp.pfi_ideregistro = uu.pfi_ideregistro ")
            .append("       INNER JOIN usuarios us ON uu.usu_ideregistro = us.usu_ideregistro ")
            .append("       INNER JOIN empresas em ON uu.emp_ideregistro = em.empresa_sevemp ")
            .append("WHERE us.usu_login = :usuario ")
            .append("  AND us.usuario_pas = :clave ")
            .append("  AND pp.pfi_ideregistro = :perfil::INTEGER ")
            .append("  AND uu.emp_ideregistro = :idempresa::INTEGER ")
            .append("  AND us.usuario_swtact = TRUE;");
    parametros.put("usuario", autenticacion.getUsuario());
    parametros.put("clave", autenticacion.getClave());
    parametros.put("idempresa", autenticacion.getIdEmpresa());
    parametros.put("perfil", Integer.valueOf(autenticacion.getParametro("idPerfil")));
    return ejecutarConsultaSimple(sql, parametros, new ConsultaAdaptador<AuditoriaDTO>()
    {
      @Override
      public AuditoriaDTO siguiente(ResultSet rs, Map<String, Integer> columns)
              throws PersistenciaExcepcion
      {
        AuditoriaDTO auditoriaExterno = new AuditoriaDTO()
                .setIdEmpresa(getObject("idempresa", Integer.class, rs))
                .setIdUsuario(getObject("idusuario", Integer.class, rs))
                .setParametro("nombreEmpresa", getObject("nombreempresa", String.class, rs))
                .setParametro("idPerfil", getObject("idperfil", String.class, rs))
                .setParametro("usuario", getObject("usuario", String.class, rs));
        return auditoriaExterno;
      }

      @Override
      public void sinResultados()
              throws PersistenciaExcepcion
      {
        throw new PersistenciaExcepcion(EMensajePersistencia.ERROR_AUTENTICACION);
      }
    });
  }

}
