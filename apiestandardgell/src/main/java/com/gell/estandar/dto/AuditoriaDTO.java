/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.dto;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author god
 */
public class AuditoriaDTO implements Serializable
{

  public static final String PARAMETRO_APLICACION = "Aplicacion";

  private String id;
  private String token;
  private int idEmpresa;
  private int idUsuario;
  private Map<String, String> parametros = new HashMap<>();

  public String getId()
  {
    return id;
  }

  public AuditoriaDTO setId(String id)
  {
    this.id = id;
    return this;
  }

  public Integer getIdEmpresa()
  {
    return idEmpresa;
  }

  public AuditoriaDTO setIdEmpresa(int idEmpresa)
  {
    this.idEmpresa = idEmpresa;
    return this;
  }

  public Integer getIdUsuario()
  {
    return idUsuario;
  }

  public AuditoriaDTO setIdUsuario(int idUsuario)
  {
    this.idUsuario = idUsuario;
    return this;
  }

  public String getToken()
  {
    return token;
  }

  public AuditoriaDTO setToken(String token)
  {
    this.token = token;
    return this;
  }

  public AuditoriaDTO setParametro(String nombre, String valor)
  {
    if (parametros == null) {
      parametros = new HashMap<>();
    }
    parametros.put(nombre, valor);
    return this;
  }

  /**
   * Consulta parámetros adicionales en la auditoria ejemplo: (idPrograma)
   *
   * @param nombre nombre del parámetro a consultar
   * @return
   */
  public String getParametro(String nombre)
  {
    return parametros.get(nombre);
  }

  public AuditoriaDTO setParametros(Map<String, String> parametros)
  {
    this.parametros = parametros;
    return this;
  }

  public Map<String, String> getParametros()
  {
    return parametros;
  }

}
