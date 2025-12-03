/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.dto;

import com.gell.estandar.persistencia.abstracto.Entidad;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.util.ValidarEntidad;
import java.lang.reflect.Type;

/**
 *
 * @author God
 */
public class PeticionDTO extends Entidad {

  private String nombreAplicacion;
  private String ruta;
  private String parametros;
  private String metodo = "POST";
  private String token;
  private String tipoContenido = "application/json;charset=UTF-8";
  private Type tipo;

  public String getNombreAplicacion()
  {
    return nombreAplicacion;
  }

  public PeticionDTO setNombreAplicacion(String nombreAplicacion)
  {
    this.nombreAplicacion = nombreAplicacion;
    return this;
  }

  public String getRuta()
  {
    return ruta;
  }

  public PeticionDTO setRuta(String ruta)
  {
    this.ruta = ruta;
    return this;
  }

  public String getParametros()
  {
    return parametros;
  }

  public PeticionDTO setParametros(String parametros)
  {
    this.parametros = parametros;
    return this;
  }

  public String getMetodo()
  {
    return metodo;
  }

  public PeticionDTO setMetodo(String metodo)
  {
    this.metodo = metodo;
    return this;
  }

  public String getToken()
  {
    return token;
  }

  public PeticionDTO setToken(String token)
  {
    this.token = token;
    return this;
  }

  public String getTipoContenido()
  {
    return tipoContenido;
  }

  public PeticionDTO setTipoContenido(String tipoContenido)
  {
    this.tipoContenido = tipoContenido;
    return this;
  }

  public Type getTipo()
  {
    return tipo;
  }

  public PeticionDTO setTipo(Type tipo)
  {
    this.tipo = tipo;
    return this;
  }

  @Override
  public <T extends Entidad> T validar()
          throws AplicacionExcepcion
  {
    ValidarEntidad.construir(this)
            .agregar("nombreAplicacion",
                    "requerido",
                    "El nombre de la aplicación es obligatoria")
            .agregar("ruta",
                    "requerido",
                    "La URL es obligatoria")
            .agregar("tipoContenido",
                    "requerido",
                    "El tipo de contenido es obligatorio")
            .agregar("tipo",
                    "requerido",
                    "El tipo de la clase es obligatorio")
            .validar();
    return (T) this;
  }

}
