/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto;

import java.util.Date;
import java.util.List;

/**
 *
 * @author lrey
 */
public class RecaudoWebDTO
{

  private Long idRecaudoWeb;
  private Date fecha = new Date();
  private Double valorPagoTotal;
  private String estado;
  private String mensaje;// = EConfiguracion.PSE.getMessage();
  private int ticketOfficeId;// = EConfiguracion.PSE.getTicketOfficeId();
  private Double vatAmount = 0D;
  /**
   * Hace referencia al campo wrec_ideregistro
   */
  private String paymentId;
  private String paymentDescription;// = EConfiguracion.PSE.getMessage();
  private String referenceNumber1;
  private String referenceNumber2;
  private String referenceNumber3;
  private String serviceCode;// = EConfiguracion.PSE.getServiceCode();
  private String email;
  private String tramaPpa_ideregistro; //id servicios adicional seleccionado
  private String paymentIdentifier;
  private Long terceroEntidad;
  private Long medioPago; //= EConfiguracion.MedioPago.getMedioPSE();
  private List<DetalleRecaudoWebDTO> listaDetalles;
  private String camposPagador;

  
  
  
  
  
  
  
  public Date getFecha()
  {
    return fecha;
  }

  public void setFecha(Date fecha)
  {
    this.fecha = fecha;
  }

  public Double getValorPagoTotal()
  {
    return valorPagoTotal;
  }

  public void setValorPagoTotal(Double valorPagoTotal)
  {
    this.valorPagoTotal = valorPagoTotal;
  }

  public String getEstado()
  {
    return estado;
  }

  public void setEstado(String estado)
  {
    this.estado = estado;
  }

  public String getMensaje()
  {
    return mensaje;
  }

  public void setMensaje(String mensaje)
  {
    this.mensaje = mensaje;
  }

  public int getTicketOfficeId()
  {
    return ticketOfficeId;
  }

  public void setTicketOfficeId(int ticketOfficeId)
  {
    this.ticketOfficeId = ticketOfficeId;
  }

  public Double getVatAmount()
  {
    return vatAmount;
  }

  public void setVatAmount(Double vatAmount)
  {
    this.vatAmount = vatAmount;
  }

  public String getPaymentId()
  {
    return paymentId;
  }

  public void setPaymentId(String paymentId)
  {
    this.paymentId = paymentId;
  }

  public String getPaymentDescription()
  {
    return paymentDescription;
  }

  public void setPaymentDescription(String paymentDescription)
  {
    this.paymentDescription = paymentDescription;
  }

  public String getReferenceNumber1()
  {
    return referenceNumber1;
  }

  public void setReferenceNumber1(String referenceNumber1)
  {
    this.referenceNumber1 = referenceNumber1;
  }

  public String getReferenceNumber2()
  {
    return referenceNumber2;
  }

  public void setReferenceNumber2(String referenceNumber2)
  {
    this.referenceNumber2 = referenceNumber2;
  }

  public String getReferenceNumber3()
  {
    return referenceNumber3;
  }

  public void setReferenceNumber3(String referenceNumber3)
  {
    this.referenceNumber3 = referenceNumber3;
  }

  public String getServiceCode()
  {
    return serviceCode;
  }

  public void setServiceCode(String serviceCode)
  {
    this.serviceCode = serviceCode;
  }

  public String getEmail()
  {
    return email;
  }

  public void setEmail(String email)
  {
    this.email = email;
  }

  public String getPaymentIdentifier()
  {
    return paymentIdentifier;
  }

  public void setPaymentIdentifier(String paymentIdentifier)
  {
    this.paymentIdentifier = paymentIdentifier;
  }

  public Long getTerceroEntidad()
  {
    return terceroEntidad;
  }

  public void setTerceroEntidad(Long terceroEntidad)
  {
    this.terceroEntidad = terceroEntidad;
  }

  public Long getMedioPago()
  {
    return medioPago;
  }

  public void setMedioPago(Long medioPago)
  {
    this.medioPago = medioPago;
  }

  public String getCamposPagador()
  {
    return camposPagador;
  }

  public void setCamposPagador(String camposPagador)
  {
    this.camposPagador = camposPagador;
  }

  public List<DetalleRecaudoWebDTO> getListaDetalles()
  {
    return listaDetalles;
  }

  public void setListaDetalles(List<DetalleRecaudoWebDTO> listaDetalles)
  {
    this.listaDetalles = listaDetalles;
  }

  public Long getIdRecaudoWeb()
  {
    return idRecaudoWeb;
  }

  public void setIdRecaudoWeb(Long idRecaudoWeb)
  {
    this.idRecaudoWeb = idRecaudoWeb;
  }

  @Override
  public String toString()
  {
    return "WrecIderegistro: " + idRecaudoWeb;
  }

    /**
     * @return the tramaPpa_ideregistro
     */
    public String getTramaPpa_ideregistro() {
        return tramaPpa_ideregistro;
    }

    /**
     * @param tramaPpa_ideregistro the tramaPpa_ideregistro to set
     */
    public void setTramaPpa_ideregistro(String tramaPpa_ideregistro) {
        this.tramaPpa_ideregistro = tramaPpa_ideregistro;
    }

}
