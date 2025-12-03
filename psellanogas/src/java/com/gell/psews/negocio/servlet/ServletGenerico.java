/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.negocio.servlet;

import com.gell.psews.negocio.constantes.EEmpresa;
import com.gell.psews.negocio.constantes.EMensajes;
import com.gell.psews.negocio.delegado.CargarInformacionDelegado;
import com.gell.psews.negocio.excepcion.NegocioExcepcion;
import com.gell.psews.negocio.procesos.ProcesoAplicacionRecaudo;
import com.gell.psews.negocio.util.LogUtil;
import com.gell.psews.negocio.procesos.ProcesoVerificacionPSE;
import com.gell.psews.negocio.util.CertificadoUtil;
import com.gell.psews.persistencia.dto.pse.ConfiguracionDTO;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author hrey
 */
public abstract class ServletGenerico extends HttpServlet
{

  public static final Map<Integer, ConfiguracionDTO> LISTA_CONFIGURACION = new HashMap<>();

  protected abstract void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException;

  @Override
  public void init()
          throws ServletException
  {
    super.init();
    initCertificado();
    LISTA_CONFIGURACION.put(EEmpresa.ID_LLANOGAS,
            new CargarInformacionDelegado(EEmpresa.ID_LLANOGAS).cargar(getPlantilla()));
    //JLMENDOZA
    LISTA_CONFIGURACION.put(EEmpresa.ID_BIOAGRICOLA,
            new CargarInformacionDelegado(EEmpresa.ID_BIOAGRICOLA).cargar(getPlantilla()));
    LISTA_CONFIGURACION.put(EEmpresa.ID_CUSIANAGAS,
            new CargarInformacionDelegado(EEmpresa.ID_CUSIANAGAS).cargar(getPlantilla()));
  }
  
  public void initCertificado(){
      try {
          CertificadoUtil.validarCertificados();
      } catch(Exception ex ){
          System.out.println(ex.getMessage());
      }
  }

  protected String getPlantilla()
  {
    return getServletContext().getRealPath("/recurso/plantilla.html");
  }

  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException
  {
    interceptarPeticion(request, response);
  }

  private void interceptarPeticion(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException
  {
   ProcesoVerificacionPSE.getInstancia().iniciarProceso();
    ProcesoAplicacionRecaudo.getInstancia().iniciarProceso();
    request.setCharacterEncoding("UTF-8");
    response.setCharacterEncoding("UTF-8");
    response.addHeader("Access-Control-Allow-Origin", "*");
    response.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.addHeader("Access-Control-Allow-Headers", "Content-Type");
    response.addHeader("Access-Control-Max-Age", "86400");
    processRequest(request, response);
    eliminarMemoria();
  }

  @Override
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException
  {
    interceptarPeticion(request, response);
  }

  @Override
  public void destroy()
  {
    detener();
    super.destroy();
  }

  protected void detener()
  {
    ProcesoAplicacionRecaudo.detener();
    ProcesoVerificacionPSE.detener();
  }

  private void eliminarMemoria()
  {
    try {
      System.gc();
    } catch (Throwable e) {
      LogUtil.error(e);
    }
  }

  public String obtenerIp(HttpServletRequest request)
  {
    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("Proxy-Client-IP");
    }
    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("WL-Proxy-Client-IP");
    }
    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("HTTP_CLIENT_IP");
    }
    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getHeader("HTTP_X_FORWARDED_FOR");
    }
    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
      ip = request.getRemoteAddr();
    }
    return ip;
  }

  public static ConfiguracionDTO getConfiguracion(int ticketOfficeId)
          throws NegocioExcepcion
  {
    Collection<ConfiguracionDTO> lista = ServletGenerico.LISTA_CONFIGURACION.values();
    for (ConfiguracionDTO configuracionDTO : lista) {
      if (configuracionDTO.getDatosPSE().getTicketOfficeId() == ticketOfficeId) {
        return configuracionDTO;
      }
    }
    throw new NegocioExcepcion(EMensajes.ERROR_NEGOCIO_CONFIGURACION, String.valueOf(ticketOfficeId));
  }

  public static ConfiguracionDTO getConfiguracionDefecto()
  {
    Collection<ConfiguracionDTO> lista = ServletGenerico.LISTA_CONFIGURACION.values();
    for (ConfiguracionDTO configuracionDTO : lista) {
      return configuracionDTO;
    }
    return null;
  }

  public static long getTiempoProcesoPSE()
  {
    Collection<ConfiguracionDTO> lista = ServletGenerico.LISTA_CONFIGURACION.values();
    Long tiempo = null;
    for (ConfiguracionDTO configuracion : lista) {
      if (tiempo == null) {
        tiempo = configuracion.getDatosPSE().getTiempoProcesoPSE();
        continue;
      }
      long tiempoEmpresa = configuracion.getDatosPSE().getTiempoProcesoPSE();
      if (tiempoEmpresa < tiempo) {
        tiempo = tiempoEmpresa;
      }
    }
    return tiempo == null ? 1000L : tiempo;
  }

}
