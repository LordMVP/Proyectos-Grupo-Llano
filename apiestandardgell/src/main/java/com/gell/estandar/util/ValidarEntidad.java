/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.util;

import com.gell.estandar.constante.EMensajeEstandar;
import com.gell.estandar.persistencia.abstracto.Entidad;
import com.gell.estandar.excepcion.AplicacionExcepcion;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

/**
 * Clase que se encarga de validar un atributo de una entidad, se recomienda
 * utilizar la clase validar Dato
 *
 * @author god
 */
public class ValidarEntidad extends FuncionesDatoUtil
{

  private final Map<String, String> listaReglas = new HashMap<>();
  private final Map<String, String> listaMensajes = new HashMap<>();
  private final Entidad entidad;

  public ValidarEntidad(Entidad entidad)
  {
    this.entidad = entidad;
  }

  /**
   * Valida una entidad si la información almacenada
   *
   * Ejemplo: La sigueinte regla verifica el atributo uniNombre y valida que el
   * campo debe ser obligatorio, correo, número y fecha al mismo tiempo
   *
   * new ReglaDTO().agregar("uniNombre", "numero|correo|requerido|fecha")
   *
   * @param entidad información a validar
   * @return
   * @throws AplicacionExcepcion
   */
  public static ValidarEntidad construir(Entidad entidad)
          throws AplicacionExcepcion
  {
    if (entidad == null) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ENTIDAD);
    }
    return new ValidarEntidad(entidad);
  }

  public ValidarEntidad agregar(String campo, String reglas)
  {
    agregar(campo, reglas, campo);
    return this;
  }

  public ValidarEntidad agregar(String campo, String reglas, String mensaje)
  {
    listaReglas.put(campo, reglas);
    listaMensajes.put(campo, mensaje);
    return this;
  }

  /**
   * Método encargado de realizar la validación de acuerdo a las reglas
   * establecidas
   *
   * @throws AplicacionExcepcion
   */
  public void validar()
          throws AplicacionExcepcion
  {
    if (listaReglas.isEmpty()) {
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_REGLAS);
    }
    Set<String> listaCampos = listaReglas.keySet();
    for (String campoGeneral : listaCampos) {
      String[] camposRecursivos = campoGeneral.split(Pattern.quote("."));
      Object valorCampo = obtenerCampoRecursivo(entidad, camposRecursivos, 0);
      validarCampo(campoGeneral, valorCampo);
    }
  }

  /**
   * Recorre el objeto y los subobjetos que están dentro y revisa y valida los
   * campos
   *
   * @param objeto Objeto a validar
   * @param camposRecursivos Recorrido que tiene que validar para encontrar si
   * el campo es válido
   * @param posicion número en el que inicia la validación
   * @return
   * @throws AplicacionExcepcion
   */
  private Object obtenerCampoRecursivo(Object objeto, String[] camposRecursivos, int posicion)
          throws AplicacionExcepcion
  {
    String campo = camposRecursivos[posicion];
    Object valorCampo = getValor(objeto, campo);
    if (valorCampo == null) {
      return null;
    }
    if (posicion == camposRecursivos.length - 1) {
      return valorCampo;
    }
    return obtenerCampoRecursivo(valorCampo, camposRecursivos, ++posicion);
  }

  /**
   * Verifica el tipo de validación que se tiene que hacer
   *
   * @param campo nombre del campo a validar
   * @param valorCampo Objeto a validar o dato
   * @throws AplicacionExcepcion El valor del objeto no cumple con la validación
   */
  private void validarCampo(String campo, Object valorCampo)
          throws AplicacionExcepcion
  {
    String reglasCampo = listaReglas.get(campo);
    String mensaje = listaMensajes.get(campo);
    String[] listaReglasCampo = reglasCampo.split(Pattern.quote("|"));
    for (String nombreRegla : listaReglasCampo) {
      switch (nombreRegla.toLowerCase()) {
        case "numero":
          validarNumero(valorCampo, mensaje);
          break;
        case "requerido":
          validarRequerido(valorCampo, mensaje);
          break;
        case "correo":
          validarCorreo(valorCampo, mensaje);
          break;
        case "fecha":
          validarFecha(valorCampo, mensaje);
          break;
        default:
          throw new AplicacionExcepcion(EMensajeEstandar.ERROR_REGLA_NO_EXISTE);
      }
    }
  }

  /**
   * Método encargado de obtener el valor de un atributo de la entidad
   *
   * @param objeto Objeto que se quiere realizar la validación
   * @param campo nombre del atributo que se quiere obtener el valor
   * @return
   * @throws AplicacionExcepcion
   */
  private Object getValor(Object objeto, String campo)
          throws AplicacionExcepcion
  {
    try {
      Field campoEntidad = objeto.getClass().getDeclaredField(campo);
      boolean accesible = campoEntidad.isAccessible();
      campoEntidad.setAccessible(true);
      Object valor = campoEntidad.get(objeto);
      campoEntidad.setAccessible(accesible);
      return valor;
    } catch (Exception ex) {
      LogUtil.error(ex);
      throw new AplicacionExcepcion(EMensajeEstandar.ERROR_CAMPO, campo);
    }
  }

  /**
   * Valida que el objeto no sea nulo
   *
   * @param <T> Clase que se está validando
   * @param entidad Objeto a validar
   * @param className Clase a crear la instancia
   * @return Instancia de la clase que se pasa como parámetro
   * @throws AplicacionExcepcion Error al validar
   */
  @SuppressWarnings("UseSpecificCatch")
  public static <T> T init(T entidad, Class<T> className)
          throws AplicacionExcepcion
  {
    if (entidad == null) {
      try {
        return className.newInstance();
      } catch (Exception ex) {
        Logger.getLogger(ValidarEntidad.class.getName()).log(Level.SEVERE, null, ex);
        throw new AplicacionExcepcion(EMensajeEstandar.ERROR_ENTIDAD);
      }
    }
    return entidad;
  }

}
