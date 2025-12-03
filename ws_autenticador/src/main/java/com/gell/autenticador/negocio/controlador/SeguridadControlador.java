/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.controlador;

import com.gell.estandar.dto.RespuestaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.autenticador.negocio.constante.ERuta;
import com.gell.autenticador.negocio.servicio.SeguridadServicio;
import com.gell.autenticador.negocio.util.AuditoriaUtil;
import com.gell.autenticador.negocio.util.TokenUtil;
import com.gell.autenticador.negocio.util.anotacion.JsonArgumento;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.persistencia.entidades.OpcOpcion;
import com.gell.estandar.dto.AutenticacionDTO;
import java.net.URISyntaxException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author god
 */
@RestController
public class SeguridadControlador extends GenericoControlador {

  @Autowired
  private SeguridadServicio seguridadServicio;

  /**
   * Servicio para generar el token
   *
   * @param autenticacion Información de la autenticación
   * @return Respuesta genérico con el token
   * @throws AplicacionExcepcion
   */
  @PostMapping(ERuta.Global.INICIO_SESION)
  public RespuestaDTO inicioSesion(@RequestBody AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    String token = seguridadServicio.autenticar(autenticacion);
    return new RespuestaDTO().setDatos(token);
  }

  /**
   * Servicio para generar el token
   *
   * @param autenticacion Información de la autenticación
   * @return Respuesta genérico con el token
   * @throws AplicacionExcepcion
   */
  @PostMapping(ERuta.Global.INICIO_SESION_NOCON_EXTERNO)
  public RespuestaDTO inicioSesionNoconExterno(@RequestBody AutenticacionDTO autenticacion)
          throws AplicacionExcepcion
  {
    String token = seguridadServicio.iniciarSesionExternoNocon(autenticacion);
    return new RespuestaDTO().setDatos(token);
  }

  /**
   * Servicio para generar el token
   *
   * @param idAcceso
   * @return Respuesta genérico con el token
   * @throws AplicacionExcepcion
   */
  @PostMapping(ERuta.Global.INICIO_SESION_PRISMA)
  public RespuestaDTO inicioSesionPrisma(@JsonArgumento("idAcceso") Long idAcceso)
          throws AplicacionExcepcion
  {
    String token = seguridadServicio.iniciarSesionPrisma(idAcceso);
    return new RespuestaDTO().setDatos(token);
  }

  /**
   * Construye el menú con todas las opciones
   *
   * @return Listado de las opciones y en orden jerárguico
   * @throws AplicacionExcepcion
   */
  @PostMapping(ERuta.Global.MENU_PRISMA)
  public RespuestaDTO menu()
          throws AplicacionExcepcion
  {
    List<OpcOpcion> listaOpciones = seguridadServicio.consultarMenu();
    return new RespuestaDTO()
            .setDatos(listaOpciones);
  }
  
  /**
   * Valida que el token tenga la estructura y la información necesaria para que
   * sea válido
   *
   * @return Información del token deserializado
   */
  @PostMapping(ERuta.Global.VALIDAR_TOKEN)
  public RespuestaDTO validarToken()
  {
    return new RespuestaDTO()
            .setDatos(AuditoriaUtil.auditoria());
  }


  @PostMapping(ERuta.Global.RENOVAR)
  public RespuestaDTO<String> renovar(@RequestBody AuditoriaDTO auditoria)
          throws AplicacionExcepcion
  {
    String token = TokenUtil.generarToken(AuditoriaUtil.auditoria());
    return new RespuestaDTO<String>()
            .setDatos(token);
  }
  
  @PostMapping(ERuta.Global.PASS_RESTABLECER)
  public RespuestaDTO olvidarClave(@RequestBody AutenticacionDTO autenticacion) 
          throws AplicacionExcepcion, URISyntaxException{
    return seguridadServicio.olvidarClave(autenticacion);
  }
  
  @PostMapping(ERuta.Global.PASS_CAMBIAR)
  public RespuestaDTO cambiarClave(
          @RequestBody AutenticacionDTO autenticacion) throws AplicacionExcepcion, 
          URISyntaxException{
    return seguridadServicio.cambiarClave(autenticacion);
  }

}
