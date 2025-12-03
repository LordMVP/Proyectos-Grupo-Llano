/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.archivos.aplicacion.seguridad;

import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.dto.AuditoriaDTO;
import com.gell.estandar.util.LogUtil;
import com.gell.estandar.comunicacion.ClienteToken;
import com.gell.estandar.constante.EAplicacion;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

/**
 *
 * @author god
 */
@SuppressWarnings("UseSpecificCatch")
public class JwtFiltroArchivos extends GenericFilterBean {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain filter)
          throws IOException, ServletException
  {
    try {
        String URL = ((HttpServletRequest) request).getRequestURI();
        
        if(URL.contains("/archivos/id/")){
            filter.doFilter(request, response);
            return;
        }        
      String token = getToken((HttpServletRequest) request);
      validarToken(token, (HttpServletRequest) request);
    } catch (Exception ex) {
      LogUtil.error(ex);
      HttpServletResponse res = (HttpServletResponse) response;
      res.sendError(401, EMensajeEstandar.ERROR_SESION_EXPIRADO.getMensaje());
      return;
    }
    response.setCharacterEncoding("UTF-8");
    response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
    filter.doFilter(request, response);
  }

  /**
   * Valida que la petición tenga un token permitido
   *
   * @param token información del token
   * @param peticion información total de la petición
   * @throws IOException Error al procesar la petición
   * @throws AplicacionExcepcion
   */
  private void validarToken(String token, HttpServletRequest peticion)
          throws IOException, AplicacionExcepcion
  {
    ClienteToken cliente = new ClienteToken(EAplicacion.ARCHIVOS);
    AuditoriaDTO auditoria = cliente.validarToken(token);
    auditoria.setParametro(AuditoriaDTO.PARAMETRO_APLICACION, getAplicacion(peticion));
    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(auditoria, null, new ArrayList<>()));
  }

  /**
   * Obtiene el token de la petición
   *
   * @param request
   * @return
   */
  private String getToken(HttpServletRequest request)
  {
    return request.getHeader("Authorization");
  }

  /**
   * Obtiene el nombre de la aplicación
   *
   * @param peticion Información de la petición
   * @return
   */
  private String getAplicacion(HttpServletRequest peticion)
  {
    String aplicacion = peticion.getHeader(AuditoriaDTO.PARAMETRO_APLICACION);
    return aplicacion;
  }

}
