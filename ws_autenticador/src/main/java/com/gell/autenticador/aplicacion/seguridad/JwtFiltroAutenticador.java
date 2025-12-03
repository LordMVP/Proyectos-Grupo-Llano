/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.aplicacion.seguridad;

import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.LogUtil;
import com.gell.autenticador.negocio.util.TokenUtil;
import com.gell.autenticador.negocio.constante.EMensajeNegocio;
import com.gell.autenticador.negocio.constante.ERuta;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

/**
 *
 * @author god
 */
@SuppressWarnings("UseSpecificCatch")
public class JwtFiltroAutenticador extends GenericFilterBean
{

  @Override
  public void doFilter(ServletRequest request, ServletResponse respuesta, FilterChain filter)
          throws IOException, ServletException
  {
    respuesta.setCharacterEncoding(StandardCharsets.UTF_8.displayName());
    HttpServletRequest peticion = (HttpServletRequest) request;
    peticion.setCharacterEncoding(StandardCharsets.UTF_8.displayName());
    HttpServletResponse servletResponse = (HttpServletResponse) respuesta;
    servletResponse.setCharacterEncoding(StandardCharsets.UTF_8.displayName());
    AuditoriaDTO auditoria = new AuditoriaDTO();
    try {
      String ruta = peticion.getServletPath();
      switch (ruta) {
        case ERuta.Global.INICIO_SESION:
        case ERuta.Global.INICIO_SESION_PRISMA:
        case ERuta.Global.INICIO_SESION_NOCON_EXTERNO:
        case ERuta.Global.PASS_RESTABLECER:
        case ERuta.Global.PASS_CAMBIAR:
          break;
        default:
          String token = getToken((HttpServletRequest) request);
          auditoria = validarToken(token);
          break;
      }
    } catch (Exception ex) {
      LogUtil.error(ex);
      HttpServletResponse res = (HttpServletResponse) respuesta;
      res.sendError(401, EMensajeNegocio.ERROR_SESION_EXPIRADO.getMensaje());
      return;
    }
    setAplicacion(peticion, auditoria);
    servletResponse.setHeader("token", generarToken(auditoria));
    setAuditoria(auditoria);
    filter.doFilter(request, respuesta);
  }

  private void setAuditoria(AuditoriaDTO auditoria)
  {
    UsernamePasswordAuthenticationToken infoSesion;
    infoSesion = new UsernamePasswordAuthenticationToken(auditoria, null, new ArrayList<>());
    SecurityContextHolder.getContext()
            .setAuthentication(infoSesion);
  }

  private void setAplicacion(HttpServletRequest peticion, AuditoriaDTO auditoria)
  {
    String aplicacion = peticion.getHeader(AuditoriaDTO.PARAMETRO_APLICACION);
    if (aplicacion == null) {
      return;
    }
    auditoria.setParametro(AuditoriaDTO.PARAMETRO_APLICACION, aplicacion);
  }

  private AuditoriaDTO validarToken(String token)
          throws IOException, AplicacionExcepcion
  {
    AuditoriaDTO auditoria = TokenUtil.validarToken(token);
    return auditoria;
  }

  private String getToken(HttpServletRequest request)
  {
    String token = request.getHeader("Authorization");
    if (token == null) {
      return null;
    }
    if (!token.startsWith("Bearer ")) {
      return null;
    }
    return token.substring(7, token.length());
  }

  private String generarToken(AuditoriaDTO auditoria)
  {
    try {
      return TokenUtil.generarToken(auditoria);
    } catch (AplicacionExcepcion ex) {
      LogUtil.error(ex);
      return "";
    }
  }

}
