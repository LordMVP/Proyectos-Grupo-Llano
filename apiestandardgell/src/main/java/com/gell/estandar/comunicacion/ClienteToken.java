  package com.gell.estandar.comunicacion;

import com.gell.estandar.constante.EAplicacion;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.dto.AutenticacionDTO;
import com.gell.estandar.dto.PeticionDTO;
import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import com.gell.estandar.util.LogUtil;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Properties;

/**
 *
 * @author God
 */
public class ClienteToken {

  private final EAplicacion nombre;
  private final String servicio;
  private static final String CONTEXTO = "/autenticador";
  private static final String INICIO_SESION = CONTEXTO + "/global/iniciosesion";
  private static final String MENU_PRISMA = CONTEXTO + "/api/global/menu/prisma";
  public static final String VALIDAR_TOKEN = CONTEXTO + "/api/global/token/validar";
  public static final String RENOVAR = CONTEXTO + "/api/global/token/renovar";
  public static final String INICIO_SESION_PRISMA = CONTEXTO + "/global/iniciosesion/prisma";
  public static final String INICIO_SESION_NOCON_EXTERNO = CONTEXTO + "/global/iniciosesion/tercero";

  /**
   * Se conecta al servicio de autenticación, por defecto busca la propiedad del
   * sistema servidor.autenticador.ip
   *
   * @param nombre Nombre de la aplicación
   */
  public ClienteToken(EAplicacion nombre)
  {
    this.nombre = nombre;
    servicio = System.getProperty("servidor.autenticador.ip");
  }

  /**
   * Se conecta al servicio que está exponiendo el método de autenticación
   *
   * @param nombre Nombre de la aplicación que está haciendo la petición
   * @param servicio Ip del servicio ejemplo: http://localhost:8080 es
   * únicamente la ubicación del servidor de autenticación
   */
  public ClienteToken(EAplicacion nombre, String servicio)
  {
    this.nombre = nombre;
    this.servicio = servicio;
  }

  public String autenticar(AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    Type tipo = new TypeToken<RespuestaDTO<String>>() {
    }.getType();
    LogUtil.info(new Gson().toJson(autenticacion));
    PeticionDTO peticion = new PeticionDTO()
            .setNombreAplicacion(nombre.getNombreAplicacion())
            .setParametros(new Gson().toJson(autenticacion))
            .setRuta(servicio + INICIO_SESION)
            .setTipo(tipo);
    RespuestaDTO<String> respuesta = Cliente.conectar(peticion);
    return respuesta.getDatos();
  }

  /**
   * Método encargado de autenticar los usuarios que están por fuera de la
   * empresa
   *
   * @param autenticacion Información de autenticación
   * @return Token cifrado
   * @throws AplicacionExcepcion Error al realizar la petición
   */
  public String autenticarExternoNocon(AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    Type tipo = new TypeToken<RespuestaDTO<String>>() {
    }.getType();
    LogUtil.info(new Gson().toJson(autenticacion));
    PeticionDTO peticion = new PeticionDTO()
            .setNombreAplicacion(nombre.getNombreAplicacion())
            .setParametros(new Gson().toJson(autenticacion))
            .setRuta(servicio + INICIO_SESION_NOCON_EXTERNO)
            .setTipo(tipo);
    RespuestaDTO<String> respuesta = Cliente.conectar(peticion);
    return respuesta.getDatos();
  }

  public String autenticarConPrisma(Integer idAcceso)
          throws AplicacionExcepcion
  {
    Properties parametros = new Properties();
    parametros.put("idAcceso", idAcceso);
    Type tipo = new TypeToken<RespuestaDTO<String>>() {
    }.getType();
    PeticionDTO peticion = new PeticionDTO()
            .setNombreAplicacion(nombre.getNombreAplicacion())
            .setParametros(new Gson().toJson(parametros))
            .setRuta(servicio + INICIO_SESION_PRISMA)
            .setTipo(tipo);
    RespuestaDTO<String> respuesta = Cliente.conectar(peticion);
    return respuesta.getDatos();
  }

  /**
   * Verifica si el token está activo aún
   *
   * @param token Cadena cifrada con las credenciales del cliente
   * @return
   * @throws AplicacionExcepcion
   */
  public AuditoriaDTO validarToken(String token)
          throws AplicacionExcepcion
  {
    Type tipo = new TypeToken<RespuestaDTO<AuditoriaDTO>>() {
    }.getType();
    PeticionDTO peticion = new PeticionDTO();
    peticion.setNombreAplicacion(nombre.getNombreAplicacion())
            .setToken(token)
            .setRuta(servicio + VALIDAR_TOKEN)
            .setTipo(tipo);
    RespuestaDTO<AuditoriaDTO> respuesta = Cliente.conectar(peticion);
    return respuesta.getDatos();
  }

  public List<OpcOpcion> menuPrisma(String token)
          throws AplicacionExcepcion
  {
    return menuPrismaGenerico(token).getDatos();
  }

  public RespuestaDTO<List<OpcOpcion>> menuPrismaGenerico(String token)
          throws AplicacionExcepcion
  {
    Type tipo = new TypeToken<RespuestaDTO<List<OpcOpcion>>>() {
    }.getType();
    PeticionDTO peticion = new PeticionDTO();
    peticion.setNombreAplicacion(nombre.getNombreAplicacion())
            .setToken(token)
            .setRuta(servicio + MENU_PRISMA)
            .setTipo(tipo);
    return Cliente.conectar(peticion);
  }

  /**
   * Genera un nuevo token con la información
   *
   * @param auditoria información del usuario autenticado
   * @return Nuevo token
   * @throws AplicacionExcepcion Error al generar el token
   */
  public String renovar(AuditoriaDTO auditoria)
          throws AplicacionExcepcion
  {
    Type tipo = new TypeToken<RespuestaDTO<String>>() {
    }.getType();
    PeticionDTO peticion = new PeticionDTO()
            .setNombreAplicacion(nombre.getNombreAplicacion())
            .setParametros(new Gson().toJson(auditoria))
            .setRuta(servicio + RENOVAR)
            .setTipo(tipo)
            .setToken(auditoria.getToken());
    RespuestaDTO<String> respuesta = Cliente.conectar(peticion);
    return respuesta.getDatos();
  }

}
