/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto.pse;

import com.gell.psews.negocio.util.LogUtil;

/**
 *
 * @author spiwer
 */
public class DatosPSE
{

  private int ticketOfficeId;
  private String password;
  private String serviceCode;
  private String entityURL;
  private String message;
  /**
   * Es el identificador que PSE le asigna a Llanogas o a Cusiana según sea el
   * caso
   */
  private String codigoPrincipal;
  /**
   * Es el código que PSE le asigna a Bioagrícola o las empresas que tienen
   * convenio la empresa principal
   */
  private String codigoSegunda;
  private String urlBancosPSE;
  private String ipPublica;
  private String servidorPrivado;
  private String servidorPublico;
  private long tiempoProcesoPSE;

  private String urlPSE;

  public int getTicketOfficeId()
  {
    return ticketOfficeId;
  }

  public DatosPSE setTicketOfficeId(int ticketOfficeId)
  {
    this.ticketOfficeId = ticketOfficeId;
    return this;
  }

  public String getPassword()
  {
    return password;
  }

  public DatosPSE setPassword(String password)
  {
    this.password = password;
    return this;
  }

  public String getServiceCode()
  {
    return serviceCode;
  }

  public DatosPSE setServiceCode(String serviceCode)
  {
    this.serviceCode = serviceCode;
    return this;
  }

  public String getEntityURL(String ipCliente)
  {
    if (ipCliente == null) {
      ipCliente = "";
    }
    LogUtil.info("Ip cliente " + ipCliente);
    if (ipPublica.equalsIgnoreCase(ipCliente)) {
      return entityURL.replaceAll("__SERVIDOR__", servidorPrivado);
    }
    if (ipCliente.startsWith("10.")) {
      return entityURL.replaceAll("__SERVIDOR__", servidorPrivado);
    }
    return entityURL.replaceAll("__SERVIDOR__", servidorPublico);
  }

  public DatosPSE setEntityURL(String entityURL)
  {
    this.entityURL = entityURL;
    return this;
  }

  public String getMessage()
  {
    return message;
  }

  public DatosPSE setMessage(String message)
  {
    this.message = message;
    return this;
  }

  public String getCodigoPrincipal()
  {
    return codigoPrincipal;
  }

  public DatosPSE setCodigoPrincipal(String codigoPrincipal)
  {
    this.codigoPrincipal = codigoPrincipal;
    return this;
  }

  public String getCodigoSegunda()
  {
    return codigoSegunda;
  }

  public DatosPSE setCodigoSegunda(String codigoSegunda)
  {
    this.codigoSegunda = codigoSegunda;
    return this;
  }

  public String getUrlBancosPSE()
  {
    return urlBancosPSE;
  }

  public DatosPSE setUrlBancosPSE(String urlPSE)
  {
    this.urlBancosPSE = urlPSE;
    return this;
  }

  public String getIpPublica()
  {
    return ipPublica;
  }

  public DatosPSE setIpPublica(String ipPublica)
  {
    this.ipPublica = ipPublica;
    return this;
  }

  public String getServidorPrivado()
  {
    return servidorPrivado;
  }

  public DatosPSE setServidorPrivado(String servidorPrivado)
  {
    this.servidorPrivado = servidorPrivado;
    return this;
  }

  public String getServidorPublico()
  {
    return servidorPublico;
  }

  public DatosPSE setServidorPublico(String servidorPublico)
  {
    this.servidorPublico = servidorPublico;
    return this;
  }

  public long getTiempoProcesoPSE()
  {
    return tiempoProcesoPSE;
  }

  public DatosPSE setTiempoProcesoPSE(long tiempoProcesoPSE)
  {
    this.tiempoProcesoPSE = tiempoProcesoPSE;
    return this;
  }

  public String getUrlPSE()
  {
    return urlPSE;
  }

  public DatosPSE setUrlPSE(String urlPSE)
  {
    this.urlPSE = urlPSE;
    return this;
  }

}
