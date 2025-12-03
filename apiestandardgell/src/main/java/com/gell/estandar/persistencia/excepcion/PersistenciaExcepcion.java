/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.persistencia.excepcion;

import com.gell.estandar.excepcion.AplicacionExcepcion;
import com.gell.estandar.plantilla.IGenericoMensaje;

/**
 *
 * @author god
 */
public class PersistenciaExcepcion extends AplicacionExcepcion
{

  public PersistenciaExcepcion(IGenericoMensaje mensaje)
  {
    super(mensaje);
  }

  public PersistenciaExcepcion(IGenericoMensaje mensaje, Object datos)
  {
    super(mensaje, datos);
  }

  public PersistenciaExcepcion(IGenericoMensaje eMensaje, String complemento)
  {
    super(eMensaje, complemento);
  }

}
