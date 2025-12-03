/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.autenticador.negocio.constante;

import com.gell.estandar.plantilla.IGenericoMensaje;

/**
 *
 * @author god
 */
public enum EMensajeNegocio implements IGenericoMensaje {
  NO_RESULTADOS(0, "No se encontraron resultados "),
  OK(1, "Petición ejecutada correctamente"),
  ERROR(-1, "Error al procesar la petición"),
  ERROR_SESION_EXPIRADO(-2, "La sesión ha expirado"),
  ERROR_TOKEN_CORRUPTO(-2, "El token es incorrecto");
  /**
   * Código del error
   */
  private final int codigo;
  /**
   * Mensaje del evento
   */
  private final String mensaje;

  private EMensajeNegocio(int codigo, String mensaje)
  {
    this.codigo = codigo;
    this.mensaje = mensaje;
  }

  @Override
  public int getCodigo()
  {
    return codigo;
  }

  @Override
  public String getMensaje()
  {
    return mensaje;
  }

}
