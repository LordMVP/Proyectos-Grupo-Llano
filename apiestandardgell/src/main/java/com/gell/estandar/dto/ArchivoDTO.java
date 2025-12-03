/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 *
 * @author God
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ArchivoDTO {

  private String id;
  private String nombre;
  private String nombreOriginal;
  private String tipo;
  private long tamanio;
  //Base 64
  private String contenido;
  private String pathRelativoAZ;

  public String getId()
  {
    return id;
  }

  public ArchivoDTO setId(String id)
  {
    this.id = id;
    return this;
  }

  public String getNombre()
  {
    return nombre;
  }

  public ArchivoDTO setNombre(String nombre)
  {
    this.nombre = nombre;
    return this;
  }

  public String getNombreOriginal()
  {
    return nombreOriginal;
  }

  public ArchivoDTO setNombreOriginal(String nombreOriginal)
  {
    this.nombreOriginal = nombreOriginal;
    return this;
  }

  public long getTamanio()
  {
    return tamanio;
  }

  public ArchivoDTO setTamanio(long size)
  {
    this.tamanio = size;
    return this;
  }

  public String getTipo()
  {
    return tipo;
  }

  public ArchivoDTO setTipo(String tipo)
  {
    this.tipo = tipo;
    return this;
  }

  public String getContenido()
  {
    return contenido;
  }

  public ArchivoDTO setContenido(String contenido)
  {
    this.contenido = contenido;
    return this;
  }

  public String getPathRelativoAZ()
  {
    return pathRelativoAZ;
  }

  public void setPathRelativoAZ(String pathRelativoAZ)
  {
    this.pathRelativoAZ = pathRelativoAZ;
  }

}
