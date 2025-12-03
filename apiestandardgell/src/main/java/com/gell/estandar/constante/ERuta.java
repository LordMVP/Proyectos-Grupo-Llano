/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.constante;

/**
 *
 * @author God
 */
public enum ERuta {

  ARCHIVO_ADJUNTAR("/api/archivos/subir", "POST", "application/json"),
  ARCHIVO_CONSULTAR("/api/archivos/consultar", "POST", "application/x-www-form-urlencoded"),
  TOKEN_GENERAR("/api/token/generar", "POST", "application/json");
  private final String url;
  private final String metodo;
  private final String tipo;
  private final String CONTEXTO = "/adjuntos";

  private ERuta(String url, String metodo, String tipo)
  {
    this.url = url;
    this.metodo = metodo;
    this.tipo = tipo;
  }

  public String getUrl()
  {
    return CONTEXTO + url;
  }

  public String getMetodo()
  {
    return metodo;
  }

  public String getTipo()
  {
    return tipo;
  }

}
