/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.servicio;

import com.gell.autenticador.persistencia.dao.AccAccesoDAO;
import com.gell.autenticador.persistencia.dao.OpcOpcionDAO;
import com.gell.autenticador.persistencia.dao.UsuariosDAO;
import com.gell.estandar.persistencia.entidades.AccAcceso;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import com.gell.estandar.persistencia.entidades.Usuarios;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.autenticador.negocio.util.TokenUtil;
import com.gell.estandar.persistencia.excepcion.PersistenciaExcepcion;
import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.util.FuncionesDatoUtil;
import com.gell.estandar.util.ValidarDato;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;

/**
 *
 * @author god
 */
@Service
public class SeguridadServicio extends GenericoServicio
{

  /**
   * Autenticación del usuario
   *
   * @param autenticacion
   * @return Lista de opciones
   * @throws PersistenciaExcepcion
   * @throws AplicacionExcepcion
   */
  @Transactional(rollbackFor = Throwable.class)
  public String autenticar(AutenticacionDTO autenticacion)
          throws PersistenciaExcepcion, AplicacionExcepcion
  {
    AuditoriaDTO auditoria = auditoria();
    String nombreAplicacion = auditoria.getParametro(AuditoriaDTO.PARAMETRO_APLICACION);
    EAplicacion aplicacion = EAplicacion.convertir(nombreAplicacion);
    switch (aplicacion) {
        case NOCON:
        case REIAL:
        case AGAU:
        case VEPOS:
        case PRISMA:
        case EMERGENCIAS:
        case DORBI:
            return iniciarSesion(autenticacion);
        case INFIS:
          return iniciarSesionInfis(autenticacion);
        case INCAIN:
            return iniciarSesionIncain(autenticacion);
        case DIRO:
            return iniciarSesionDiro(autenticacion);
        case RISISE:
            return iniciarSesionRisise(autenticacion);
      case TARGAS:
        return iniciarSesionTargas(autenticacion);
        default:
            throw new AplicacionExcepcion(EMensajeEstandar.ERROR_APLICACION);
    }
  }
  
  @Transactional(rollbackFor = Throwable.class)
  public RespuestaDTO olvidarClave(AutenticacionDTO autenticacion)
          throws PersistenciaExcepcion, AplicacionExcepcion, URISyntaxException
  {
    AuditoriaDTO auditoria = auditoria();
    String nombreAplicacion = auditoria.getParametro(AuditoriaDTO.PARAMETRO_APLICACION);
    EAplicacion aplicacion = EAplicacion.convertir(nombreAplicacion);
    switch (aplicacion) {
        //case NOCON:
        //case REIAL:
        //case AGAU:
        //case VEPOS:
        case PRISMA:
        	return olvidarClaveHomafo(autenticacion);
        //case INFIS:
        //case INCAIN:
        case DIRO:
            return olvidarClaveDiro(autenticacion);
        default:
            throw new AplicacionExcepcion(EMensajeEstandar.ERROR_APLICACION);
    }
  }
  
  
  @Transactional(rollbackFor = Throwable.class)
  public RespuestaDTO cambiarClave(AutenticacionDTO autenticacion) throws 
          PersistenciaExcepcion, AplicacionExcepcion, URISyntaxException
  {
    AuditoriaDTO auditoria = auditoria();
    String nombreAplicacion = auditoria.getParametro(AuditoriaDTO.PARAMETRO_APLICACION);
    EAplicacion aplicacion = EAplicacion.convertir(nombreAplicacion);
    switch (aplicacion) {
        //case NOCON:
        //case REIAL:
        //case AGAU:
        //case VEPOS:
        case PRISMA:
        	return cambiarClaveHomafo(autenticacion);
        //case INFIS:
        //case INCAIN:
        case DIRO:
            return cambiarClaveDiro(autenticacion);
        default:
            throw new AplicacionExcepcion(EMensajeEstandar.ERROR_APLICACION);
    }
  }

  /**
   * Realiza la autenticaciòn del usuario con las tablas Seven para Infis...
   *
   * @param autenticacionDTO
   * @return
   * @throws PersistenciaExcepcion
   * @throws AplicacionExcepcion
   */
  private String iniciarSesionInfis(AutenticacionDTO autenticacionDTO)
          throws PersistenciaExcepcion, AplicacionExcepcion
  {
    AuditoriaDTO usuario = new UsuariosDAO(dataSourceSeven, auditoria())
            .inicioSesionInfis(autenticacionDTO);
    usuario.getParametros().putAll(autenticacionDTO.getParametros());
    return TokenUtil.generarToken(usuario);
  }
  
  private String iniciarSesionIncain(AutenticacionDTO autenticacionDTO)
          throws PersistenciaExcepcion, AplicacionExcepcion
  {
    AuditoriaDTO usuario = new UsuariosDAO(dataSourceSeven, auditoria())
            .inicioSesionIncain(autenticacionDTO);
    usuario.getParametros().putAll(autenticacionDTO.getParametros());
    return TokenUtil.generarToken(usuario);
  }
  
  private String iniciarSesionDiro(AutenticacionDTO autenticacionDTO)
          throws PersistenciaExcepcion, AplicacionExcepcion
  {
    AuditoriaDTO usuario = new UsuariosDAO(dataSourceKactus, auditoria())
            .inicioSesionDiro(autenticacionDTO);
    usuario.getParametros().putAll(autenticacionDTO.getParametros());
    return TokenUtil.generarToken(usuario);
  }
  
  
  private RespuestaDTO olvidarClaveDiro(AutenticacionDTO autenticacionDTO)
          throws PersistenciaExcepcion, AplicacionExcepcion, URISyntaxException {
    
    UsuariosDAO usuariosDAO = new UsuariosDAO(dataSourceKactus, auditoria());  
    
    HashMap<String, String> datos = new HashMap<>();
    RespuestaDTO respuesta = new RespuestaDTO(-1, 
            "No se proceso correctamente la solicitud del cambio de clave.");  
    
    String correo = usuariosDAO.consultarCorreoUsuarioDiro(autenticacionDTO);
    
    if (correo == null) {
        
        throw new AplicacionExcepcion(-1, "No existe un correo asociado al usuario "
                + autenticacionDTO.getUsuario()+", por favor comuniquese con el administrador.");
        
    }
    
    AuditoriaDTO usuario = new UsuariosDAO(dataSourceKactus, auditoria())
            .olvidarClaveDiro(autenticacionDTO);
    
    String idConfirmacion = usuariosDAO.consultarIdConfirmacionDiro(autenticacionDTO).trim();
    
    if(usuario.getParametros().isEmpty()) {
    
        throw new AplicacionExcepcion(-1, "No fue posible la solicitud de cambio "
                + "de clave del usuario "+autenticacionDTO.getUsuario()+".");
        
    }
    
    datos.put("Correo", correo);
    datos.put("Id Confirmacion", idConfirmacion);
    datos.put("Usuario", usuario.getParametro("usuario"));
    
    respuesta.setCodigo(1);
    respuesta.setMensaje("Solicitud de cambio de contraseña realizada correctamente.");
    respuesta.setDatos(datos);
   
    return respuesta;
  }
  
  /* Olvido Clave App Homafo */
  private RespuestaDTO olvidarClaveHomafo(AutenticacionDTO autenticacionDTO)
          throws PersistenciaExcepcion, AplicacionExcepcion, URISyntaxException {
    
    UsuariosDAO usuariosDAO = new UsuariosDAO(dataSource, auditoria());  
    
    HashMap<String, String> datos = new HashMap<>();
    RespuestaDTO respuesta = new RespuestaDTO(-1, 
            "No se proceso correctamente la solicitud del cambio de clave.");  
    
    String correo = usuariosDAO.consultarCorreoUsuarioHomafo(autenticacionDTO);
    
    if (correo == null) {
        
        throw new AplicacionExcepcion(-1, "No existe un correo asociado al usuario "
                + autenticacionDTO.getUsuario()+", por favor comuniquese con el administrador.");
        
    }
    
    AuditoriaDTO usuario = new UsuariosDAO(dataSource, auditoria())
            .olvidarClaveHomafo(autenticacionDTO);
    
    String idConfirmacion = usuariosDAO.consultarIdConfirmacionHomafo(autenticacionDTO).trim();
    
    if(usuario.getParametros().isEmpty()) {
    
        throw new AplicacionExcepcion(-1, "No fue posible la solicitud de cambio "
                + "de clave del usuario "+autenticacionDTO.getUsuario()+".");
        
    }
    
    datos.put("Correo", correo);
    datos.put("Id Confirmacion", idConfirmacion);
    datos.put("Usuario", usuario.getParametro("usuario"));
    
    respuesta.setCodigo(1);
    respuesta.setMensaje("Solicitud de cambio de contraseña realizada correctamente.");
    respuesta.setDatos(datos);
   
    return respuesta;
  }
  
  
  private RespuestaDTO cambiarClaveDiro(AutenticacionDTO autenticacionDTO) throws 
          PersistenciaExcepcion, AplicacionExcepcion, URISyntaxException {
    
    UsuariosDAO usuariosDAO = new UsuariosDAO(dataSourceKactus, auditoria());  
    
    HashMap<String, String> datos = new HashMap<>();
    RespuestaDTO respuesta = new RespuestaDTO(-1, 
            "No se proceso correctamente el cambio de clave.");  
    
    String idConfirmacion = autenticacionDTO.getParametro("IdConfirmacion");
    
    AuditoriaDTO usuario = usuariosDAO.cambiarClaveDiro(autenticacionDTO, idConfirmacion);    
    
    if(usuario.getParametros().isEmpty()) {
    
        throw new AplicacionExcepcion(-1, "No fue posible elcambio de clave del "
                + "usuario "+autenticacionDTO.getUsuario()+".");
        
    }
    
    datos.put("Usuario", usuario.getParametro("usuario"));
    
    respuesta.setCodigo(1);
    respuesta.setMensaje("Cambio de contraseña realizada correctamente.");
    respuesta.setDatos(datos);
   
    return respuesta;
  }
  
  private RespuestaDTO cambiarClaveHomafo(AutenticacionDTO autenticacionDTO) throws 
  PersistenciaExcepcion, AplicacionExcepcion, URISyntaxException {

	  UsuariosDAO usuariosDAO = new UsuariosDAO(dataSource, auditoria());  

	  HashMap<String, String> datos = new HashMap<>();
	  RespuestaDTO respuesta = new RespuestaDTO(-1, 
			  "No se proceso correctamente el cambio de clave.");  

	  String idConfirmacion = autenticacionDTO.getParametro("IdConfirmacion");

	  AuditoriaDTO usuario = usuariosDAO.cambiarClaveHomafo(autenticacionDTO, idConfirmacion);    

	  if(usuario.getParametros().isEmpty()) {

		  throw new AplicacionExcepcion(-1, "No fue posible elcambio de clave del "
				  + "usuario "+autenticacionDTO.getUsuario()+".");

	}

	  datos.put("Usuario", usuario.getParametro("usuario"));

	  respuesta.setCodigo(1);
	  respuesta.setMensaje("Cambio de contraseña realizada correctamente.");
	  respuesta.setDatos(datos);

	  return respuesta;
  }

  /**
   * Realiza la autenticación del usuario con las tablas de prisma
   *
   * @param autenticacion Información del usuario que está autenticandose
   * @return Token
   * @throws AplicacionExcepcion
   */
  private String iniciarSesion(AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    AuditoriaDTO auditoria = new UsuariosDAO(dataSource, auditoria())
            .autenticar(autenticacion);
    auditoria.getParametros().putAll(autenticacion.getParametros());
    return registrarAcceso(auditoria);
  }

  private String iniciarSesionTargas(AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    AuditoriaDTO auditoria = new UsuariosDAO(dataSourceTargas, auditoria())
            .autenticar(autenticacion);
    auditoria.getParametros().putAll(autenticacion.getParametros());
    String perfil = auditoria.getParametro("idPerfil");
    Integer idPerfil = Integer.valueOf(perfil);
    AccAcceso acceso = new AccAcceso()
            .setAccEstado("I")
            .setAccFecingreso(new Date())
            .setEmpIderegistro(auditoria.getIdEmpresa())
            .setPfiIderegistro(idPerfil);
    Usuarios usuario = new Usuarios();
    usuario.setUsuIderegistro(auditoria.getIdUsuario());
    acceso.setUsuIderegistro(usuario);
    new AccAccesoDAO(dataSourceTargas, auditoria).insertar(acceso);
    auditoria.setId(acceso.getAccIderegistro().toString());
    return TokenUtil.generarToken(auditoria);
  }

  /*

   */
  private String iniciarSesionRisise(AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    AuditoriaDTO auditoria = new UsuariosDAO(dataSourceRisise, auditoria())
            .autenticarRisise(autenticacion);
    auditoria.getParametros().putAll(autenticacion.getParametros());
    String perfil = auditoria.getParametro("idPerfil");
    Integer idPerfil = Integer.valueOf(perfil);
    AccAcceso acceso = new AccAcceso()
            .setAccEstado("I")
            .setAccFecingreso(new Date())
            .setEmpIderegistro(auditoria.getIdEmpresa())
            .setPfiIderegistro(idPerfil);
    Usuarios usuario = new Usuarios();
    usuario.setUsuIderegistro(auditoria.getIdUsuario());
    acceso.setUsuIderegistro(usuario);
    new AccAccesoDAO(dataSourceRisise, auditoria).insertar(acceso);
    auditoria.setId(acceso.getAccIderegistro().toString());
    return TokenUtil.generarToken(auditoria);
  }
  /**
   * Registrar la información del usuario que ha iniciado sesión
   *
   * @param auditoria Información de la sesión
   * @return Token cifrado con la información
   * @throws AplicacionExcepcion Error al generar el token o registrar la
   * información en la base de datos
   */
  private String registrarAcceso(AuditoriaDTO auditoria)
          throws AplicacionExcepcion
  {
    String perfil = auditoria.getParametro("idPerfil");
    ValidarDato.construir()
            .agregar(perfil, "requerido|numero", "El identificador del perfil es requerido")
            .validar();
    Integer idPerfil = Integer.valueOf(perfil);
    AccAcceso acceso = new AccAcceso()
            .setAccEstado("I")
            .setAccFecingreso(new Date())
            .setEmpIderegistro(auditoria.getIdEmpresa())
            .setPfiIderegistro(idPerfil);
    Usuarios usuario = new Usuarios();
    usuario.setUsuIderegistro(auditoria.getIdUsuario());
    acceso.setUsuIderegistro(usuario);
    new AccAccesoDAO(dataSource, auditoria).insertar(acceso);
    auditoria.setId(acceso.getAccIderegistro().toString());
    return TokenUtil.generarToken(auditoria);
  }

  /**
   * Realiza la autenticación del usuario con las tablas de prisma
   *
   *
   * @param idAcceso
   * @return Token
   * @throws AplicacionExcepcion
   */
  @Transactional(readOnly = true)
  public String iniciarSesionPrisma(Long idAcceso)
          throws AplicacionExcepcion
  {
    AuditoriaDTO auditoria = new UsuariosDAO(dataSource, auditoria())
            .autenticarSesionPrisma(idAcceso);
    Integer idPerfil = Integer.valueOf(auditoria.getParametro("idPerfil"));
    AccAcceso acceso = new AccAcceso()
            .setAccEstado("I")
            .setAccFecingreso(new Date())
            .setEmpIderegistro(auditoria.getIdEmpresa())
            .setPfiIderegistro(idPerfil)
            .setAccIderegistro(idAcceso);
    Usuarios usuario = new Usuarios();
    usuario.setUsuIderegistro(auditoria.getIdUsuario());
    acceso.setUsuIderegistro(usuario);
    auditoria.setId(acceso.getAccIderegistro().toString());
    return TokenUtil.generarToken(auditoria);
  }

  /**
   * Consulta y construye el menú del usuario
   *
   * @return @throws AplicacionExcepcion
   */
  @Transactional(rollbackFor = Throwable.class)
  public List<OpcOpcion> consultarMenu()
          throws AplicacionExcepcion
  {
    OpcOpcionDAO opcOpcionDAO = new OpcOpcionDAO(dataSource, auditoria());
    List<OpcOpcion> menu = opcOpcionDAO.consultarMenu();
    List<OpcOpcion> itemsPrincipal = menu.stream()
            .filter((opcion) -> opcion.getOpcIdepadre().getOpcIderegistro() == null)
            .collect(Collectors.toList());
    itemsPrincipal.forEach((opcOpcion) -> {
      construirOpciones(opcOpcion, menu);
    });
    return itemsPrincipal;
  }

  /**
   * Construye las opciones que le pertenecen a cada items
   *
   * @param opcionPrincipal Información de la opción padre
   * @param menu Listado de todas las opciones que puede acceder el usuario
   */
  private void construirOpciones(OpcOpcion opcionPrincipal, List<OpcOpcion> menu)
  {
    List<OpcOpcion> menuItems = menu.stream().filter((OpcOpcion opcion) -> {
      Integer idOpcion = opcion.getOpcIdepadre().getOpcIderegistro();
      if (idOpcion == null) {
        return false;
      }
      return Objects.equals(idOpcion, opcionPrincipal.getOpcIderegistro());
    }).collect(Collectors.toList());
    if (menuItems == null || menuItems.isEmpty()) {
      return;
    }
    opcionPrincipal.setMenuItem(menuItems);
    menuItems.forEach((opcion) -> {
      construirOpciones(opcion, menu);
    });
  }

  /**
   * Método encargado de registrar y validar el usuario con el respectivo perfil
   *
   * @param autenticacion Información de usuario,clave, empresa y perfil
   * @return Información del usuario con la empresa que está iniciando sesión
   * @throws AplicacionExcepcion Error al registrar y validar el usuario
   */
  @Transactional(rollbackFor = Throwable.class)
  public String iniciarSesionExternoNocon(AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    AuditoriaDTO autenticarExternoNocon = new UsuariosDAO(dataSource, auditoria())
            .autenticarExternoNocon(autenticacion);
    Map<String, Object> info = new HashMap<>();
    info.put("token", registrarAcceso(autenticarExternoNocon));
    info.put("usuario", autenticarExternoNocon.getParametro("usuario"));
    info.put("idusuario", autenticarExternoNocon.getIdUsuario());
    info.put("idempresa", autenticarExternoNocon.getIdEmpresa());
    return FuncionesDatoUtil.json(info);
  }

}
