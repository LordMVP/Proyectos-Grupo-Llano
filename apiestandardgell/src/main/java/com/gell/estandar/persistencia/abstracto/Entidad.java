/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gell.estandar.persistencia.abstracto;

import com.gell.estandar.excepcion.AplicacionExcepcion;

/**
 *
 * @author god
 */
public abstract class Entidad {

  private Object Info;

  public Object getInfo()
  {
    return Info;
  }

  public void setInfo(Object Info)
  {
    this.Info = Info;
  }

  public abstract <T extends Entidad> T validar()
          throws AplicacionExcepcion;

}
