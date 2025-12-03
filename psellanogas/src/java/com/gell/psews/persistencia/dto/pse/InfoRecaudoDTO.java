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
public class InfoRecaudoDTO
{

  private int oficina;
  private int usuario;
  private int medio;
  private int formaPago;
  private int oficinaaseo;

  public int getOficina()
  {
    return oficina;
  }

  public InfoRecaudoDTO setOficina(int oficina)
  {
    this.oficina = oficina;
    return this;
  }

  public int getUsuario()
  {
    return usuario;
  }

  public InfoRecaudoDTO setUsuario(int usuario)
  {
    this.usuario = usuario;
    return this;
  }

  public int getMedio()
  {
    return medio;
  }

  public InfoRecaudoDTO setMedio(int medio)
  {
    this.medio = medio;
    return this;
  }

  public int getFormaPago()
  {
    return formaPago;
  }

  public InfoRecaudoDTO setFormaPago(int formaPago)
  {
    this.formaPago = formaPago;
    return this;
  }

    /**
     * @return the oficinaaseo
     */
    public int getOficinaaseo() {
        return oficinaaseo;
    }

    /**
     * @param oficinaaseo the oficinaaseo to set
     */
    public InfoRecaudoDTO  setOficinaaseo(int oficinaaseo) {
        this.oficinaaseo = oficinaaseo;
        return this;
    }

}
