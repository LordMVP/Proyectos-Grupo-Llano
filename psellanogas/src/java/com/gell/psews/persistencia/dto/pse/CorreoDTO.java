/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.psews.persistencia.dto.pse;

/**
 *
 * @author spiwer
 */
public class CorreoDTO
{

  private String asunto = "Recaudo-PSE Aplicar recaudo";
  private String servidor;
  private String startTls;
  private int puerto;
  private String autenticacion;
  private String mail;
  private String clave;
  private String correoDestino;
  private String correoDestinoCopia;
  private String plantilla;

  public String getAsunto()
  {
    return asunto;
  }

  public CorreoDTO setAsunto(String asunto)
  {
    this.asunto = asunto;
    return this;
  }

  public String getServidor()
  {
    return servidor;
  }

  public CorreoDTO setServidor(String servidor)
  {
    this.servidor = servidor;
    return this;
  }

  public String getStartTls()
  {
    return startTls;
  }

  public CorreoDTO setStartTls(String startTls)
  {
    this.startTls = startTls;
    return this;
  }

  public int getPuerto()
  {
    return puerto;
  }

  public CorreoDTO setPuerto(int puerto)
  {
    this.puerto = puerto;
    return this;
  }

  public String getAutenticacion()
  {
    return autenticacion;
  }

  public CorreoDTO setAutenticacion(String autenticacion)
  {
    this.autenticacion = autenticacion;
    return this;
  }

  public String getMail()
  {
    return mail;
  }

  public CorreoDTO setMail(String mail)
  {
    this.mail = mail;
    return this;
  }

  public String getClave()
  {
    return clave;
  }

  public CorreoDTO setClave(String clave)
  {
    this.clave = clave;
    return this;
  }

  public String getCorreoDestino()
  {
    return correoDestino;
  }

  public CorreoDTO setCorreoDestino(String correoDestino)
  {
    this.correoDestino = correoDestino;
    return this;
  }

  public String getCorreoDestinoCopia()
  {
    return correoDestinoCopia;
  }

  public CorreoDTO setCorreoDestinoCopia(String correoDestinoCopia)
  {
    this.correoDestinoCopia = correoDestinoCopia;
    return this;
  }

  public String getPlantilla()
  {
    return plantilla;
  }

  public CorreoDTO setPlantilla(String plantilla)
  {
    this.plantilla = plantilla;
    return this;
  }

}
